<template>
  <div class="bg-base-300 container w-screen">
    <!-- Chat section -->
    <div class="flex flex-col flex-grow max-h-screen">
      <div class="navbar bg-base-100">
        <div class="flex-1">
          <button @click="() => router.back()" class="mr-2">
            <svg
              class="fill-current text-accent hover:text-accent-focus"
              height="30px"
              width="30px"
              viewBox="0 0 512 512"
            >
              <polygon
                points="213.3,205.3 213.3,77.3 0,248 213.3,418.7 213.3,290.7 512,290.7 512,205.3 "
              ></polygon>
            </svg>
          </button>
          <a class="normal-case text-xl">{{ chat.user.name }}</a>
        </div>
      </div>

      <!-- Chat messages container -->
      <div id="chat-messages" class="h-3/4 flex-grow overflow-y-scroll p-4">
        <div v-if="pages > 1" class="mb-4 flex justify-center">
          <button
            :disabled="loading"
            @click="fetchOlderMessages"
            class="btn bg-accent focus:bg-accent-focus hover:bg-accent-focus text-accent-content"
          >
            {{ loading ? 'PLEASE WAIT...' : 'LOAD OLDER MESSAGES' }}
          </button>
        </div>
        <div class="flex flex-col flex-nowrap content-stretch justify-start">
          <div v-for="cluster in messageClusters" :key="cluster.userId" class="flex flex-col">
            <div
              v-for="message in cluster.messages"
              :key="message.id"
              class="mb-4"
              :class="[isUserMessages(cluster) ? 'self-end ' : 'self-start']"
            >
              <div
                :class="[
                  isUserMessages(cluster)
                    ? 'bg-primary text-primary-content hover:bg-primary-focus'
                    : 'bg-secondary text-secondary-content hover:bg-secondary-focus'
                ]"
                class="chat-bubble break-words max-w-xs"
              >
                <span>{{ message.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Chat input -->
      <div class="p-4 h-1/4 sticky">
        <div class="flex items-center h-full space-x-2">
          <textarea
            v-model="messageInput"
            class="flex-grow textarea textarea-neutral focus:textarea-neutral-focus hover:textarea-neutral-focus text-neutral-content"
            placeholder="Leave a message"
            maxlength="2000"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="sendingMessage"
            class="bg-accent focus:bg-accent-focus hover:bg-accent-focus text-accent-content rounded-lg min-h-12 pt-4 pb-4 pl-4 pr-4 w-[6%]"
          >
            Send
            <p>{{ messageInput.length }} / 2000</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ChatService from '../chat'
import MessageService from '../services/message.service'
import CableService from '../services/cable.service'

const route = useRoute()

const router = useRouter()

const chat = ref({ user: { name: 'User' } })

const messageClusters = ref([])

const pages = ref(0)

const chatRoom = ref({})

const userData = useAuthStore()

const loading = ref(false)

const messageInput = ref('')

const sendingMessage = ref(false)

onMounted(async () => fetchMessages())

async function fetchMessages() {
  chat.value = await ChatService.getChat(route.params.id)

  const paginatedMessages = await MessageService.getMessages(route.params.id)

  messageClusters.value = MessageService.createClusters(paginatedMessages.messages)
  pages.value = paginatedMessages.pages

  await CableService.chatRoom(route.params.id, (data) => {
    MessageService.pushToClusters(messageClusters.value, JSON.parse(data))
  })
}

function isUserMessages(cluster) {
  return cluster.userId === userData?.authData?.user?.id
}

async function fetchOlderMessages() {
  const scrollable = document.getElementById('chat-messages')

  const sH = scrollable.scrollHeight
  const sT = scrollable.scrollTop

  loading.value = true

  const messageId = messageClusters.value[0].messages[0].id

  const paginatedOldMessages = await MessageService.getMessages(route.params.id, messageId).finally(
    () => {
      loading.value = false
      setTimeout(() => {
        scrollable.scrollTop = scrollable.scrollHeight - sH + sT
      }, 0)
    }
  )

  if (paginatedOldMessages.messages.length > 0) {
    const oldMessageClusters = MessageService.createClusters(paginatedOldMessages.messages)
    messageClusters.value = MessageService.combineClusters(
      oldMessageClusters,
      messageClusters.value
    )

    pages.value = paginatedOldMessages.pages
  }
}

async function sendMessage() {
  const trimmed = messageInput.value && messageInput.value.trim()

  if (trimmed && chatRoom.value && !sendingMessage.value) {
    sendingMessage.value = true

    await MessageService.sendMessage(chat.value.id, { content: trimmed }).finally(async () => {
      sendingMessage.value = false

      messageClusters.value.push({
        userId: userData.user.id,
        messages: [{ id: 1, type: 'message', content: trimmed }]
      })
    })

    messageInput.value = ''
  }
}
</script>
