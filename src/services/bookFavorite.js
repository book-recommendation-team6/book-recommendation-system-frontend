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