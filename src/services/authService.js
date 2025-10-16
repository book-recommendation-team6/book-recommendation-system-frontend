import api from '../config/ApiConfig.js'

export const getUser = async () => {
    try {
        const response = await api.get("/users/profile");
        console.log("Get user profile response:", response);
        return response;
    } catch (error) {
        console.error('Get user profile failed:', error.response?.data || error.message)
        throw error
    }
}


export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password })
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message)
        throw error
    }
}

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData)
        return response;
    } catch (error) {
        console.error('Register failed:', error.response?.data || error.message)
        throw error
    }
}
