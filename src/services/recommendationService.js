import axios from 'axios';

// Recommendation System API Base URL
const RS_API_BASE_URL = 'http://localhost:8001/api/v1';

const rsApi = axios.create({
  baseURL: RS_API_BASE_URL,
  timeout: 30000, // 30s timeout for retrain endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
rsApi.interceptors.request.use(
  (config) => {
    console.log(`[RS API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[RS API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
rsApi.interceptors.response.use(
  (response) => {
    console.log(`[RS API] Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[RS API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Get health status of recommendation system
 * @returns {Promise<{status: string, models_loaded: boolean}>}
 */
export const getHealthStatus = async () => {
  try {
    const response = await rsApi.get('/health');
    return response.data;
  } catch (error) {
    console.error('Failed to get health status:', error);
    throw error;
  }
};

/**
 * Get model information
 * @returns {Promise<Object>} Model info including CF and Content-Based models
 */
export const getModelInfo = async () => {
  try {
    const response = await rsApi.get('/model/info');
    return response.data;
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
};

/**
 * Trigger model retraining (Admin only)
 * @returns {Promise<{status: string, message: string}>}
 */
export const triggerRetrain = async () => {
  try {
    const response = await rsApi.post('/retrain');
    return response.data;
  } catch (error) {
    console.error('Failed to trigger retrain:', error);
    throw error;
  }
};

/**
 * Get personalized recommendations for a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of recommendations (default: 10, max: 100)
 * @returns {Promise<{user_id: number, limit: number, items: Array}>}
 */
export const getRecommendations = async (userId, limit = 10) => {
  try {
    const response = await rsApi.get('/recommendations', {
      params: { user_id: userId, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    throw error;
  }
};

/**
 * Get similar books
 * @param {number} bookId - Book ID
 * @param {number} limit - Number of similar books (default: 10, max: 100)
 * @returns {Promise<{book_id: number, items: Array}>}
 */
export const getSimilarBooks = async (bookId, limit = 10) => {
  try {
    const response = await rsApi.get('/similar', {
      params: { book_id: bookId, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get similar books:', error);
    throw error;
  }
};

/**
 * Record user feedback (for online learning)
 * @param {number} userId - User ID
 * @param {number} bookId - Book ID
 * @param {string} event - Event type: 'view', 'favorite', 'rating', 'read'
 * @param {number} value - Optional value (e.g., rating value)
 * @returns {Promise<{status: string}>}
 */
export const recordFeedback = async (userId, bookId, event, value = null) => {
  try {
    const response = await rsApi.post('/feedback', {
      user_id: userId,
      book_id: bookId,
      event,
      value,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to record feedback:', error);
    throw error;
  }
};

export default {
  getHealthStatus,
  getModelInfo,
  triggerRetrain,
  getRecommendations,
  getSimilarBooks,
  recordFeedback,
};
