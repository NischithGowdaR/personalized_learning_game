const Groq = require('groq-sdk');

// Initialize the Groq client. It will automatically read process.env.GROQ_API_KEY
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates personalized questions based on user background, selected parameters, and performance.
 * @param {Object} params
 * @param {string} params.subject - The subject of the game
 * @param {string} params.topic - The requested topic
 * @param {string} params.difficulty - Beginner, Intermediate, Advanced, Adaptive
 * @param {string} params.gameType - Multiple Choice, etc.
 * @param {number} params.numQuestions - Number of questions to generate (5, 10, 15, 20)
 * @param {Object} params.userHistory - Custom personalization history
 * @param {number} params.userLevel - User's current calculated level (1-5)
 * @param {Array} params.weakTopics - User's identified weak topics
 * @param {Array} params.strongTopics - User's identified strong topics
 * @returns {Promise<Array>} - Array of question objects
 */
const generatePersonalizedQuestions = async ({
  subject,
  topic,
  difficulty,
  gameType,
  numQuestions,
  userHistory = {},
  userLevel = 1,
  weakTopics = [],
  strongTopics = [],
}) => {
  // Construct user background prompt text
  const historyText = Object.entries(userHistory)
    .map(([t, stats]) => `- ${t}: ${stats.accuracy}% accuracy (${stats.correct}/${stats.total} correct)`)
    .join('\n');

  const systemPrompt = `You are an expert AI educator and curriculum designer. Your task is to generate high-quality, educational questions customized for a student.
You must return your output ONLY as a valid, parsable JSON object. No conversation, no explanations outside the JSON, no markdown formatting (like wrapping in markdown code blocks), and no extra text.

The JSON schema must be exactly:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "Option B",
      "explanation": "Detailed educational explanation of why Option B is correct and others are incorrect.",
      "difficulty": "Beginner | Intermediate | Advanced",
      "topic": "Topic Name"
    }
  ]
}

CRITICAL RULES:
1. Do not include markdown code block syntax (like \`\`\`json ... \`\`\`) in your response. Just start and end with curly braces.
2. The options array must contain exactly 4 unique choices.
3. The correctAnswer must match exactly one of the strings in the options array.
4. The explanation should be rich, informative, and friendly.
5. All questions must match the requested subject: "${subject}" and topic: "${topic}".
6. Scale the questions' depth, language, and concept difficulty to match the user's details.`;

  const userPrompt = `Generate exactly ${numQuestions} questions of type "${gameType}" for:
Subject: ${subject}
Topic: ${topic}
Target Difficulty: ${difficulty}

Student Background Context:
- Student Current Level: ${userLevel} (out of 5)
- Overall target difficulty style: ${difficulty === 'Adaptive' ? 'Adapt dynamically based on topic performance' : difficulty}
- Weak topics in this domain: [${weakTopics.join(', ')}]
- Strong topics in this domain: [${strongTopics.join(', ')}]
- Topic History:
${historyText || 'No prior game history for this topic.'}

Personalization Instruction:
- If the student has low accuracy on this topic (<50% or in Weak Topics), skew the difficulty to Beginner/Intermediate and provide deeper, step-by-step explanations.
- If the student has high accuracy (>=80% or in Strong Topics) or the target is Advanced, generate challenging questions focusing on edge cases, optimization, or advanced theory.
- Ensure the questions flow in a logical learning progression (earlier questions establish core concepts, later questions test application/exceptions).`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    let rawContent = response.choices[0].message.content.trim();
    
    // Safety check: Strip markdown code blocks if the LLM outputted them despite instructions
    if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Initial JSON parse failed. Content was:', rawContent);
      // Let's attempt a basic regex cleanup for common LLM JSON errors
      const jsonStart = rawContent.indexOf('{');
      const jsonEnd = rawContent.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleaned = rawContent.substring(jsonStart, jsonEnd + 1);
        parsed = JSON.parse(cleaned);
      } else {
        throw parseError;
      }
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('AI response is missing "questions" array');
    }

    // Validate structure of generated questions
    const validatedQuestions = parsed.questions.map((q, idx) => {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) {
        throw new Error(`AI question at index ${idx} is missing required fields`);
      }
      // Ensure there are 4 options (fill standard placeholders if missing)
      let options = [...q.options];
      while (options.length < 4) {
        options.push(`Option ${options.length + 1}`);
      }
      options = options.slice(0, 4);

      // Ensure the correct answer is one of the options
      let correctAnswer = q.correctAnswer;
      if (!options.includes(correctAnswer)) {
        // Fallback: overwrite the first option or set the correctAnswer as one of the options
        options[0] = correctAnswer;
      }

      return {
        question: q.question,
        options: options,
        correctAnswer: correctAnswer,
        explanation: q.explanation || 'No explanation provided.',
        difficulty: q.difficulty || (difficulty === 'Adaptive' ? 'Intermediate' : difficulty),
        topic: q.topic || topic,
      };
    });

    return validatedQuestions;
  } catch (error) {
    console.error('Groq Generation Error:', error.message);
    throw new Error(`Failed to generate personalized questions from AI: ${error.message}`);
  }
};

module.exports = {
  generatePersonalizedQuestions,
};
