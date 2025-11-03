import axios from 'axios';
import api from '../config/ApiConfig.js';

const REQUEST_TIMEOUT = 30000;

let rsApi = null;
let modelRegistry = [];
let activeModelKey = null;

const createRsApi = (baseUrl) => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      console.log(`[RS API] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('[RS API] Request error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log('[RS API] Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('[RS API] Response error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return instance;
};

const ensureRsApi = async () => {
  if (!rsApi) {
    await refreshModelRegistry();
  }
  return rsApi;
};

export const refreshModelRegistry = async () => {
  try {
    const response = await api.get('/admin/recommendation/models');
    const payload = response?.data ?? {};
    const models = payload?.models ?? [];
    const activeKey = payload?.activeKey ?? models[0]?.key ?? null;

    if (!activeKey) {
      throw new Error('No recommendation models configured');
    }

    const activeModel = models.find((model) => model.key === activeKey);
    if (!activeModel?.baseUrl) {
      throw new Error('Active recommendation model is missing base URL');
    }

    modelRegistry = models;
    activeModelKey = activeKey;
    rsApi = createRsApi(activeModel.baseUrl);
    console.info(
      `[RS API] Active model synced: ${activeModel.label || activeModel.key} (${activeModel.baseUrl})`
    );

    return { models, activeKey };
  } catch (error) {
    console.error('Failed to refresh recommendation model registry:', error);
    rsApi = null;
    modelRegistry = [];
    activeModelKey = null;
    throw error;
  }
};

export const getAvailableRecommendationModels = async (force = false) => {
  if (force || modelRegistry.length === 0) {
    await refreshModelRegistry();
  }
  return modelRegistry;
};

export const getActiveRecommendationModelKey = async () => {
  if (!activeModelKey) {
    await refreshModelRegistry();
  }
  return activeModelKey;
};

export const setActiveRecommendationModel = async (modelKey) => {
  try {
    const response = await api.put(`/admin/recommendation/models/${modelKey}`);
    const modelInfo = response?.data;

    if (!modelInfo?.baseUrl) {
      throw new Error('Active recommendation model response missing base URL');
    }

    activeModelKey = modelInfo.key ?? modelKey;
    rsApi = createRsApi(modelInfo.baseUrl);

    modelRegistry = modelRegistry.map((model) => ({
      ...model,
      active: model.key === activeModelKey,
      baseUrl: model.key === activeModelKey ? modelInfo.baseUrl : model.baseUrl,
      label: model.key === activeModelKey && modelInfo.label ? modelInfo.label : model.label,
      supportsOnlineLearning:
        model.key === activeModelKey && typeof modelInfo.supportsOnlineLearning === 'boolean'
          ? modelInfo.supportsOnlineLearning
          : model.supportsOnlineLearning,
    }));

    // If registry did not previously contain the activated model, append it.
    if (!modelRegistry.some((model) => model.key === activeModelKey)) {
      modelRegistry = [
        ...modelRegistry,
        {
          key: activeModelKey,
          label: modelInfo.label ?? activeModelKey,
          baseUrl: modelInfo.baseUrl,
          supportsOnlineLearning: !!modelInfo.supportsOnlineLearning,
          active: true,
        },
      ];
    }

    console.info(
      `[RS API] Active model switched to ${modelInfo.label || modelInfo.key} (${modelInfo.baseUrl})`
    );

    return modelInfo;
  } catch (error) {
    console.error('Failed to set active recommendation model:', error);
    throw error;
  }
};

/**
 * Get health status of recommendation system
 * @returns {Promise<{status: string, models_loaded: boolean}>}
 */
export const getHealthStatus = async () => {
  try {
    const client = await ensureRsApi();
    const response = await client.get('/health');
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
    const client = await ensureRsApi();
    const response = await client.get('/model/info');
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
    const client = await ensureRsApi();
    const response = await client.post('/retrain');
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
    const client = await ensureRsApi();
    const response = await client.get('/recommendations', {
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
    const client = await ensureRsApi();
    const response = await client.get('/similar', {
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
 * @param {string} event - Event type: 'view', 'favorite', 'rate'
 * @param {number} value - Optional value (e.g., rating value)
 * @returns {Promise<{status: string}>}
 */
export const recordFeedback = async (userId, bookId, event, value = null) => {
  try {
    const client = await ensureRsApi();
    const response = await client.post('/feedback', {
      user_id: userId,
      book_id: bookId,
      event,
      rating_value: value,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to record feedback:', error);
    throw error;
  }
};

/**
 * Get online learning status
 * @returns {Promise<Object>}
 */
export const getOnlineLearningStatus = async () => {
  try {
    const client = await ensureRsApi();
    const response = await client.get('/online-learning/status');
    return response.data;
  } catch (error) {
    console.error('Failed to get online learning status:', error);
    throw error;
  }
};

/**
 * Enable online learning
 * @param {number} bufferSize - Buffer size (10-1000)
 * @returns {Promise<Object>}
 */
export const enableOnlineLearning = async (bufferSize = 100) => {
  try {
    const client = await ensureRsApi();
    const response = await client.post('/online-learning/enable', null, {
      params: { buffer_size: bufferSize },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to enable online learning:', error);
    throw error;
  }
};

/**
 * Disable online learning
 * @returns {Promise<Object>}
 */
export const disableOnlineLearning = async () => {
  try {
    const client = await ensureRsApi();
    const response = await client.post('/online-learning/disable');
    return response.data;
  } catch (error) {
    console.error('Failed to disable online learning:', error);
    throw error;
  }
};

/**
 * Trigger incremental update
 * @param {boolean} force - Force update even if buffer is not full
 * @returns {Promise<Object>}
 */
export const triggerIncrementalUpdate = async (force = false) => {
  try {
    const client = await ensureRsApi();
    const response = await client.post('/online-learning/update', null, {
      params: { force },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to trigger incremental update:', error);
    throw error;
  }
};

export default {
  refreshModelRegistry,
  getAvailableRecommendationModels,
  getActiveRecommendationModelKey,
  setActiveRecommendationModel,
  getHealthStatus,
  getModelInfo,
  triggerRetrain,
  getRecommendations,
  getSimilarBooks,
  recordFeedback,
  getOnlineLearningStatus,
  enableOnlineLearning,
  disableOnlineLearning,
  triggerIncrementalUpdate,
};
