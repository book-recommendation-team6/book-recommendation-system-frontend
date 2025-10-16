import api from '../config/ApiConfig.js'

export const getBookFavourites = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/favourites`);
        console.log('Get favourites response:', response);
        return response;
    } catch (error) {
        console.error('Get favourites failed:', error.response?.data || error.message);
        throw error;
    }
}