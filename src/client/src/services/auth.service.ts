import api from './api'
import { useRouter } from 'vue-router'

export interface LoginCredentials {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        email: string
        // ... other user fields
    }
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials)
        return data
    },
    logout: async () => {
        const router = useRouter()
        const { data } = await api.post('/auth/logout')
        localStorage.removeItem('token')
        router.push('/')
        return data
    },
}
