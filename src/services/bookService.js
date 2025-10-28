import api from '../config/ApiConfig.js'

export const getBookDetail = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch book detail:", error);
    throw error;
  }
};
