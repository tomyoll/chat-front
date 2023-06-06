import { createConsumer } from '@rails/actioncable'

class CableService {
  constructor() {
    this.cable = null
    this.channel = null
    this.notificationsChannel = null
    this.notificationsReceived = null
    this.contexts = {}
  }
  async connect() {
    if (!this.cable) {
      this.cable = createConsumer(
        this.#buildUrl(import.meta.env.VITE_CABLE_URL, {
          Authorization: localStorage.getItem('auth_token')
        })
      )
    }
  }

  #buildUrl(url, params) {
    if (!params) {
      return url
    }

    const paramString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    return [url, paramString].join('?')
  }

  chatRoom(chatId, callback) {
    if (!this.cable) {
      this.connect()
    }
    return this.cable.subscriptions.create(
      { channel: 'ChatChannel', chat_id: +chatId },
      { received: (data) => callback(data) }
    )
  }

  /**
   * Called when a subscription to an Action Cable server channel successfully completes. Calls connected on the component channel
   * @param {Object} channel - The component channel
   */
  _channelConnected(channel) {
    if (channel.connected) {
      channel.connected.call(this.contexts[channel._uid].context)
    }

    console.log(`Successfully connected to channel '${channel._name}'.`, 'info')
  }

  _channelReceived(channel, data) {
    if (channel.received) {
      channel.received.call(this.contexts[channel._uid].context, data)
    }

    console.log(`Message received on channel '${channel._name}'.`, 'info')
  }
}

export default new CableService()
