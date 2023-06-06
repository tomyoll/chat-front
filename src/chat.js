import http from './http'

class ChatService {
  async getChat(chatId) {
    return http.get({ path: `/chats/${chatId}` })
  }
}

export default new ChatService()
