import api from '../config/ApiConfig.js';


const getAuthors = async () => {
  try {
    const response = await api.get('/authors');
    return response.data;
  } catch (error) {
    console.error("Error fetching authors:", error);
    throw error;
  }
};

export { getAuthors };
