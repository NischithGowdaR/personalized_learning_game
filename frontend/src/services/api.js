const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Check the current origin hostname
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return 'https://personalized-learning-game.onrender.com/api';
};

const API_URL = getApiUrl();

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

const api = {
  // Auth endpoints
  register: (userData) =>
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  login: (credentials) =>
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  getMe: () =>
    fetchWithAuth('/auth/me', {
      method: 'GET',
    }),

  // Game endpoints
  generateGame: (config) =>
    fetchWithAuth('/games/generate', {
      method: 'POST',
      body: JSON.stringify(config),
    }),
    
  getGames: () =>
    fetchWithAuth('/games', {
      method: 'GET',
    }),
    
  getGameById: (id) =>
    fetchWithAuth(`/games/${id}`, {
      method: 'GET',
    }),
    
  submitGame: (id, results) =>
    fetchWithAuth(`/games/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(results),
    }),

  // Progress endpoints
  getProgress: () =>
    fetchWithAuth('/progress', {
      method: 'GET',
    }),
    
  getTopicProgress: () =>
    fetchWithAuth('/progress/topics', {
      method: 'GET',
    }),
    
  getRecommendations: () =>
    fetchWithAuth('/progress/recommendations', {
      method: 'GET',
    }),

  // User profile endpoints
  getProfile: () =>
    fetchWithAuth('/users/profile', {
      method: 'GET',
    }),
    
  updateProfile: (profileData) =>
    fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
    
  getBadges: () =>
    fetchWithAuth('/users/badges', {
      method: 'GET',
    }),
};

export default api;
export { API_URL };
