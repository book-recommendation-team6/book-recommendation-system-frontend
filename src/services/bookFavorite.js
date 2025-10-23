import api from '../config/ApiConfig.js'

export const getBookFavorites = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/favorites`);
        console.log('Get favorites response:', response);
        return response.data;
    } catch (error) {
        console.error('Get favorites failed:', error.response?.data || error.message);
        throw error;
    }
}

export const addFavorite = async (userId, bookId) => {
    try {
        const response = await api.post(`/users/${userId}/favorites/${bookId}`);
        console.log('Add favorite response:', response);
        return response.data;
    } catch (error) {
        console.error('Add favorite failed:', error.response?.data || error.message);
        throw error;
    }
}

export const removeFavorite = async (userId, bookId) => {
    try {
        const response = await api.delete(`/users/${userId}/favorites/${bookId}`);
        console.log('Remove favorite response:', response);
        return response.data;
    } catch (error) {
        console.error('Remove favorite failed:', error.response?.data || error.message);
        throw error;
    }
}