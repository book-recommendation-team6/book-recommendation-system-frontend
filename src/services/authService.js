import api from '../config/ApiConfig.js'

export const login = async (email, password) => {
    try {
        const data = await api.post('/auth/login', { email, password })
        return data
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message)
        throw error
    }
}

export const register = async (userData) => {
    try {
        const data = await api.post('/auth/register', userData)
        return data
    } catch (error) {
        console.error('Register failed:', error.response?.data || error.message)
        throw error
    }
}
