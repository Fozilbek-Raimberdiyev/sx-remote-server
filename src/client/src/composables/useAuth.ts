import { useMutation } from '@tanstack/vue-query'
import { authService, type LoginCredentials } from '../services/auth.service'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('token', data.token)
      // Redirect to dashboard
      router.push('/dashboard')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
  })

  return {
    login: loginMutation,
    logout: logoutMutation,
  }
}