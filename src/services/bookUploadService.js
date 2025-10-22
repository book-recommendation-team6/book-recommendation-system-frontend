import api from '../config/ApiConfig.js';

const uploadBook = async (formData) => {
  try {
    const response = await api.post('/books/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading book:", error);
    throw error;
  }
};


export { uploadBook };

