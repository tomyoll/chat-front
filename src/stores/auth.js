import { defineStore } from 'pinia'

export const useAuthStore = defineStore('[Auth]', {
  state: () => ({
    user: {
      id: 0,
      name: '',
      email: '',
      first_name: '',
      last_name: '',
      visible: true
    },
    session: {
      authToken: ''
    }
  }),

  getters: {
    IS_AUTHORIZED: (state) => {
      return !!state.session.authToken
    },

    GET_TOKEN: (state) => {
      return state.session.authToken
    }
  },

  actions: {
    LOGIN({ auth_token, user }) {
      this.user = user
      this.session.authToken = auth_token
      window.location.href = '/'
    },

    REFRESH_SESSION({ auth_token }) {
      this.session = { authToken: auth_token }
    },

    LOGOUT() {
      localStorage.clear()

      this.$reset()

      window.location.href = '/login'
    }
  }
})
