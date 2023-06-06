import axios from 'axios'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

class Api {
  constructor() {
    this.loginUrl = '/login'

    this.endpoint = import.meta.env.VITE_API_URL

    this.instance = axios.create()

    this.store = useAuthStore()

    this.router = useRouter()

    this.notificationStore = useAuthStore()

    this.instance.interceptors.request.use(async (config) => {
      if (!this.store.user.id && localStorage.getItem('auth_token')) {
        const tokenInfo = await axios.get(`${import.meta.env.VITE_API_URL}auth/validate`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (tokenInfo.data) {
          this.store.LOGIN({
            auth_token: localStorage.getItem('auth_token'),
            user: tokenInfo.data,
            withRedirect: false
          })
          return config
        } else {
          localStorage.removeItem('user')
          localStorage.removeItem('auth_token')
          window.location.href = this.loginUrl
        }
      }

      return config
    })
  }

  post({ path = '', data = {}, fullResponse = false }) {
    return this._send({ method: 'POST', path, data, fullResponse })
  }

  put({ path = '', data = {} }) {
    return this._send({ method: 'PUT', path, data })
  }

  patch({ path = '', data = {} }) {
    return this._send({ method: 'PATCH', path, data })
  }

  get({ path = '', data = {}, params = {}, fullResponse = false }) {
    return this._send({ method: 'GET', path, data, params, fullResponse })
  }

  delete({ path = '', data = {} }) {
    return this._send({ method: 'DELETE', path, data })
  }

  async _send({ method = 'GET', path = '', data = {}, params = {}, fullResponse = false }) {
    const headers = { ContentType: 'application/json', Accept: 'application/json' }

    const token = localStorage.getItem('auth_token')

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      // @ts-ignore
      const response = await this.instance({
        method,
        url: `${this.endpoint}${path}`,
        params,
        data,
        headers
      })

      if (fullResponse) {
        return response
      }

      if (response && response.data) {
        return response.data
      }

      return null
    } catch (error) {
      if (error.response.status === 422) {
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }

      return { error: error.response.data.message }
    }
  }
}

export default new Api()
