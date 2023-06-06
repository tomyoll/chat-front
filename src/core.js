import http from './http'
import { useAuthStore } from './stores/auth'
import { useNotificationStore } from './stores/notification'

const notificationStore = useNotificationStore()

class Core {
  constructor() {
    this.store = useAuthStore()
  }

  async logIn({ email, password }) {
    try {
      const loginResponse = await http.post({
        path: '/auth/login',
        data: { email, password }
      })

      if (loginResponse.error) {
        notificationStore.ADD({
          title: loginResponse.error
        })

        return
      }

      this.store.LOGIN(loginResponse)

      localStorage.setItem('user', JSON.stringify(loginResponse.user))
      localStorage.setItem('auth_token', loginResponse['auth_token'])
    } catch (e) {
      return e
    }
  }

  async register({ firstName, lastName, email, password }) {
    try {
      const registerResponse = await http.post({
        path: '/signup',
        data: { first_name: firstName, last_name: lastName, email, password }
      })

      if (registerResponse.error) {
        notificationStore.ADD({
          title: registerResponse.error
        })

        return
      }

      window.location.href = '/login'
    } catch (e) {
      return e
    }
  }
}

export default new Core()
