import api from '../config/ApiConfig.js'


export const getUserHistory = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/history`);
        console.log('Get history response:', response);
        return response.data;
    } catch (error) {
        console.error('Get history failed:', error.response?.data || error.message);
        throw error;
    }  
}