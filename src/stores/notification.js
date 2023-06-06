import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    buffer: [],
    updateTimeout: null
  }),

  getters: {
    GET_ALL: (state) => {
      return state.buffer
    }
  },

  actions: {
    ADD({ type = 'info', title = '', message = '' }) {
      this.buffer.push({ type, title, message, id: new Date().getTime() })
      this._updateNotification()
    },

    _updateNotification() {
      if (this.buffer.length > 0 && this.updateTimeout === null) {
        this.updateTimeout = setInterval(() => {
          this.buffer.shift()
          this._updateNotification()
        }, 3000)
      }
      if (this.buffer.length === 0 && this.updateTimeout) {
        clearInterval(this.updateTimeout)
        this.updateTimeout = null
      }
    },

    REMOVE(index) {
      this.buffer.splice(index, 1)
      this._updateNotification()
    }
  }
})
