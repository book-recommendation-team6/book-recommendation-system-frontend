import api from "../config/ApiConfig.js";

export const fetchBookmarks = async (userId, bookId) => {
  try {
    const response = await api.get(`/users/${userId}/books/${bookId}/bookmarks`);
    return response.data ?? [];
  } catch (error) {
    console.error("Fetch bookmarks failed:", error.response?.data || error.message);
    throw error;
  }
};

export const createBookmark = async (userId, bookId, payload) => {
  try {
    const response = await api.post(`/users/${userId}/books/${bookId}/bookmarks`, payload);
    return response.data;
  } catch (error) {
    console.error("Create bookmark failed:", error.response?.data || error.message);
    throw error;
  }
};

export const updateBookmark = async (userId, bookmarkId, payload) => {
  try {
    const response = await api.put(`/users/${userId}/bookmarks/${bookmarkId}`, payload);
    return response.data;
  } catch (error) {
    console.error("Update bookmark failed:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBookmark = async (userId, bookmarkId) => {
  try {
    await api.delete(`/users/${userId}/bookmarks/${bookmarkId}`);
  } catch (error) {
    console.error("Delete bookmark failed:", error.response?.data || error.message);
    throw error;
  }
};
