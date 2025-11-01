import api from '../config/ApiConfig.js'

export const getRecommendedBooks = async (userId, limit = 10) => {
  try {
    const response = await api.get('/recommendations', {
      params: { userId, limit }
    });
    console.log("Recommended books response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch recommended books:", error);
    throw error;
  }
};

export const getSimilarBooks = async (bookId, limit = 10) => {
  try {
    const response = await api.get('/similar-books', {
      params: { bookId, limit }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch similar books:", error);
    throw error;
  }
};

export const getBookDetail = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch book detail:", error);
    throw error;
  }
};
