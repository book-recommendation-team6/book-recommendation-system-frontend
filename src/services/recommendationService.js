import axios from 'axios';
import { axiosClient } from '../utils/axiousClient';

const DEFAULT_MODEL_INFO = {
  key: 'implicit',
  label: 'Implicit ALS + SBERT',
  baseUrl: 'http://localhost:8001/api/v1',
  supportsOnlineLearning: true,
  active: true,
};

const ACTIVE_MODEL_STORAGE_KEY = 'activeRecommendationModel';
const MODEL_OPTIONS_STORAGE_KEY = 'availableRecommendationModels';
const MODEL_REGISTRY_TTL_MS = 30_000;
const ACTIVE_MODEL_REFRESH_TTL_MS = 15_000;

const safeParse = (raw, fallback = null) => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('[RS API] Failed to parse cached data:', error);
    return fallback;
  }
};

const loadActiveModelFromStorage = () => {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_MODEL_INFO };
  }
  const cached = safeParse(window.localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY));
  if (cached?.baseUrl) {
    return cached;
  }
  return { ...DEFAULT_MODEL_INFO };
};

const loadModelsFromStorage = () => {
  if (typeof window === 'undefined') {
    return [];
  }
  const cached = safeParse(window.localStorage.getItem(MODEL_OPTIONS_STORAGE_KEY), []);
  if (Array.isArray(cached)) {
    return cached;
  }
  return [];
};

const persistActiveModel = (info) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, JSON.stringify(info));
  } catch (error) {
    console.warn('[RS API] Failed to persist active model:', error);
  }
};

const persistModelOptions = (models) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MODEL_OPTIONS_STORAGE_KEY, JSON.stringify(models));
  } catch (error) {
    console.warn('[RS API] Failed to persist model options:', error);
  }
};

let activeModelInfo = loadActiveModelFromStorage();
let modelOptionsCache = loadModelsFromStorage();
let lastRegistryFetch = 0;
let lastActiveFetch = 0;

const rsApi = axios.create({
  baseURL: activeModelInfo.baseUrl,
  timeout: 30000, // 30s timeout for retrain endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

const setActiveModelCache = (info) => {
  if (!info?.baseUrl) {
    return;
  }
  activeModelInfo = {
    ...info,
    key: info.key || info.modelKey || DEFAULT_MODEL_INFO.key,
  };
  rsApi.defaults.baseURL = activeModelInfo.baseUrl;
  persistActiveModel(activeModelInfo);
  lastActiveFetch = Date.now();
};

// Initialize axios base URL from cached data
setActiveModelCache(activeModelInfo);

const setModelOptionsCache = (models) => {
  if (!Array.isArray(models)) {
    return;
  }
  modelOptionsCache = models;
  persistModelOptions(models);
};

// Add request interceptor for logging
rsApi.interceptors.request.use(
  (config) => {
    console.log(`[RS API] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);
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
    console.log('[RS API] Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[RS API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const getApiData = (response) => response?.data?.data ?? response?.data ?? null;

const fetchActiveModelInfo = async () => {
  try {
    const response = await axiosClient.get('/recommendation/active-model');
    const payload = getApiData(response);
    if (payload?.baseUrl) {
      setActiveModelCache(payload);
    }
    lastActiveFetch = Date.now();
    return payload;
  } catch (error) {
    console.warn('[RS API] Failed to fetch active recommendation model:', error.message);
    return null;
  }
};

const ensureActiveModel = async ({ forceRefresh = false } = {}) => {
  const needsRefresh = Date.now() - lastActiveFetch > ACTIVE_MODEL_REFRESH_TTL_MS;
  if (!forceRefresh && activeModelInfo?.baseUrl && !needsRefresh) {
    return activeModelInfo;
  }

  const info = await fetchActiveModelInfo();
  if (info?.baseUrl) {
    return info;
  }

  // Fallback to default if no info available
  setActiveModelCache(activeModelInfo?.baseUrl ? activeModelInfo : DEFAULT_MODEL_INFO);
  return activeModelInfo;
};

const callRecsys = async (method, url, options = {}) => {
  const { forceRefresh = false, ...axiosConfig } = options;
  await ensureActiveModel({ forceRefresh });
  return rsApi.request({ method, url, ...axiosConfig });
};

/**
 * Refresh model registry (admin only)
 * @param {boolean} force - Force refresh even if cache is warm
 * @returns {Promise<{models: Array, activeKey: string}>}
 */
export const refreshModelRegistry = async (force = false) => {
  if (!force && modelOptionsCache.length && Date.now() - lastRegistryFetch < MODEL_REGISTRY_TTL_MS) {
    return {
      models: modelOptionsCache,
      activeKey: activeModelInfo?.key,
    };
  }

  const response = await axiosClient.get('/admin/recommendation/models');
  const payload = getApiData(response);
  const models = payload?.models ?? [];
  const activeKey = payload?.activeKey
    ?? models.find((model) => model.active)?.key
    ?? activeModelInfo?.key
    ?? DEFAULT_MODEL_INFO.key;

  setModelOptionsCache(models);
  lastRegistryFetch = Date.now();

  const active = models.find((model) => model.key === activeKey);
  if (active?.baseUrl) {
    setActiveModelCache(active);
  }

  return {
    models,
    activeKey,
  };
};

/**
 * Get model options list (admin only)
 */
export const getAvailableRecommendationModels = async (force = false) => {
  if (!force && modelOptionsCache.length) {
    return modelOptionsCache;
  }
  const { models } = await refreshModelRegistry(true);
  return models;
};

/**
 * Set active recommendation model (admin only)
 */
export const setActiveRecommendationModel = async (modelKey) => {
  const response = await axiosClient.put(`/admin/recommendation/models/${modelKey}`);
  const payload = getApiData(response);

  if (payload?.baseUrl) {
    setActiveModelCache(payload);
    setModelOptionsCache(
      modelOptionsCache.map((model) => ({
        ...model,
        active: model.key === payload.key,
      }))
    );
  }

  return payload;
};

/**
 * Get health status of recommendation system
 */
export const getHealthStatus = async (options = {}) => {
  try {
    const response = await callRecsys('get', '/health', options);
    return response.data;
  } catch (error) {
    console.error('Failed to get health status:', error);
    throw error;
  }
};

/**
 * Get model information
 */
export const getModelInfo = async (options = {}) => {
  try {
    const response = await callRecsys('get', '/model/info', options);
    return response.data;
  } catch (error) {
    console.error('Failed to get model info:', error);
    throw error;
  }
};

/**
 * Trigger model retraining (Admin only)
 */
export const triggerRetrain = async (options = {}) => {
  try {
    const response = await callRecsys('post', '/retrain', options);
    return response.data;
  } catch (error) {
    console.error('Failed to trigger retrain:', error);
    throw error;
  }
};

/**
 * Get personalized recommendations for a user
 */
export const getRecommendations = async (userId, limit = 10, options = {}) => {
  try {
    const response = await callRecsys('get', '/recommendations', {
      params: { user_id: userId, limit },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get recommendations:', error);
    throw error;
  }
};

/**
 * Get similar books
 */
export const getSimilarBooks = async (bookId, limit = 10, options = {}) => {
  try {
    const response = await callRecsys('get', '/similar', {
      params: { book_id: bookId, limit },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get similar books:', error);
    throw error;
  }
};

/**
 * Record user feedback (for online learning)
 */
export const recordFeedback = async (userId, bookId, event, value = null, options = {}) => {
  try {
    const response = await callRecsys('post', '/feedback', {
      data: {
        user_id: userId,
        book_id: bookId,
        event,
        rating_value: value,
      },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to record feedback:', error);
    throw error;
  }
};

/**
 * Get online learning status
 */
export const getOnlineLearningStatus = async (options = {}) => {
  try {
    const response = await callRecsys('get', '/online-learning/status', options);
    return response.data;
  } catch (error) {
    console.error('Failed to get online learning status:', error);
    throw error;
  }
};

/**
 * Enable online learning
 */
export const enableOnlineLearning = async (bufferSize = 100, options = {}) => {
  try {
    const response = await callRecsys('post', '/online-learning/enable', {
      params: { buffer_size: bufferSize },
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to enable online learning:', error);
    throw error;
  }
};

/**
 * Disable online learning
 */
export const disableOnlineLearning = async (options = {}) => {
  try {
    const response = await callRecsys('post', '/online-learning/disable', options);
    return response.data;
  } catch (error) {
    console.error('Failed to disable online learning:', error);
    throw error;
  }
};

/**
 * Trigger incremental update
 */
export const triggerIncrementalUpdate = async (force = false, options = {}) => {
  try {
    const response = await callRecsys('post', '/online-learning/update', {
      params: { force },
      ...options,
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
