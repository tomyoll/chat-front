import http from '../http'

class MessageService {
  async getMessages(chatId, before) {
    const params = { ...(before ? { before } : {}) }

    const result = await http.get({ path: `/chats/${chatId}/messages`, params })

    result.messages.reverse()

    return result
  }

  async sendMessage(chatId, message) {
    return http.post({ path: `/chats/${chatId}/messages`, data: message })
  }

  createClusters(messages) {
    const clusters = []
    messages.forEach((message) => {
      this.pushToClusters(clusters, message)
    })
    return clusters
  }

  pushToClusters(clusters = [], message) {
    if (clusters.length > 0 && this.#lastOf(clusters).userId === message.user.id) {
      this.#lastOf(clusters).messages.push(message)
      return
    }

    clusters.push({ userId: message.user.id, messages: [message] })
  }

  combineClusters(cluster1, cluster2) {
    if (this.#lastOf(cluster1).userId === this.#firstOf(cluster2).userId) {
      const cluster1Copy = cluster1.slice()
      const cluster2Copy = cluster2.slice(1)
      this.#lastOf(cluster1Copy).messages.push(...this.#firstOf(cluster2).messages)
      return [...cluster1Copy, ...cluster2Copy]
    }

    return [...cluster1, ...cluster2]
  }

  #firstOf(array) {
    return array[0]
  }

  #lastOf(array) {
    return array[array.length - 1]
  }
}

export default new MessageService()
