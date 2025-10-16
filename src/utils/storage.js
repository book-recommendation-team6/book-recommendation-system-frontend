const AUTH_TOKEN_KEY = 'jwt'
const AUTH_USER_KEY = 'auth_user'

export function setAuthData(token, user) {
    try {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))

        console.log('Auth data stored successfully')
    } catch (error) {
        console.error('Failed to store Auth data:', error)
        throw new Error('Failed to save login data')
    }
}

export function updateAuthUser(updatedUser) {
    try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))
    } catch (error) {
        console.error('Failed to update Auth user:', error)
    }
}

export function getAuthData() {
    try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY)
        const userJson = localStorage.getItem(AUTH_USER_KEY)
        const user = userJson ? JSON.parse(userJson) : null
        return {token, user}
    } catch (error) {
        console.error('Failed to retrieve Auth data:', error)
        clearAuthData()
        return {token: null, user: null}
    }
}

export function clearAuthData() {
    try {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
        console.log('Auth data cleared successfully')
    } catch (error) {
        console.error('Failed to clear Auth data:', error)
    }
}

export function getToken() {
    const {token} = getAuthData()
    return token
}