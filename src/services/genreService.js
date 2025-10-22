import api from '../config/ApiConfig.js';

const getGenres = async () => {
  try {
    const response = await api.get('/genres');
    return response.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export { getGenres };
