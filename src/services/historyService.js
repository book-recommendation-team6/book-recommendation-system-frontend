import api from "../config/ApiConfig.js";

export const getUserHistory = async (userId, { page = 0, size = 8 } = {}) => {
  try {
    const response = await api.get(`/users/${userId}/history`, {
      params: { page, size },
    });

    const pageData = response.data ?? null;

    return {
      history: pageData?.content ?? [],
      page: pageData,
      message: response.message,
    };
  } catch (error) {
    console.error("Get history failed:", error.response?.data || error.message);
    throw error;
  }
};

export const recordReadingHistory = async (userId, bookId, payload) => {
  try {
    const response = await api.post(`/users/${userId}/books/${bookId}/history`, payload);
    return response.data;
  } catch (error) {
    console.error("Record reading history failed:", error.response?.data || error.message);
    throw error;
  }
};
