<script setup>
import http from '../http'
import { onMounted, ref } from 'vue'
import { useNotificationStore } from '../stores/notification'
import Notification from './AlertNotification.component.vue'
import Search from './SearchComponent.component.vue'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationStore()

const showNotification = (message, type) => {
  notificationStore.addNotification({
    id: Date.now(),
    message,
    type
  })
}

const router = useRouter()

const chats = ref([])

const users = ref([])

const searchText = ref('')

const page = ref(0)

onMounted(async () => {
  try {
    const result = await http.get({ path: 'chats/' })
    chats.value = result
  } catch (e) {
    return showNotification(e?.response?.data?.message)
  }
})

async function onSearch(text) {
  page.value = 1

  searchText.value = text

  await fetchUsers()
}

async function fetchUsers() {
  const usersResponse = await http.get({
    path: '/users',
    params: { query: searchText.value, page: page.value }
  })

  users.value = usersResponse.users
}
</script>

<template>
  <div class="container w-screen gap-0 columns-2">
    <div class="h-screen menu bg-base-100">
      <div class="mt-3">
        <h1 class="text-base-content ml-10">CHATS</h1>
        <div class="mt-3">
          <ul v-for="chat in chats" :key="chat.id" class="menu">
            <div class="divider"></div>
            <div class="flex items-center m-3">
              <svg class="fill-current text-accent" height="30px" width="30px" viewBox="0 0 60 60">
                <path
                  d="M0,8l0,33c0,3.252,2.748,6,6,6h8v10c0,0.413,0.254,0.784,0.639,0.933C14.757,57.979,14.879,58,15,58
		c0.276,0,0.546-0.114,0.74-0.327L25.442,47H54c3.252,0,6-2.748,6-6V8c0-3.252-2.748-6-6-6H6C2.748,2,0,4.748,0,8z M40,24
		c0-2.206,1.794-4,4-4s4,1.794,4,4s-1.794,4-4,4S40,26.206,40,24z M26,24c0-2.206,1.794-4,4-4s4,1.794,4,4s-1.794,4-4,4
		S26,26.206,26,24z M12,24c0-2.206,1.794-4,4-4s4,1.794,4,4s-1.794,4-4,4S12,26.206,12,24z"
                />
              </svg>
              <div
                @click="() => router.push(`/chat/${chat.id}`)"
                class="ml-3 bg-base-300 text-base-content cursor-pointer rounded-xl p-5 w-full hover:bg-base-200"
              >
                <p>{{ chat.user.name }}</p>
                <p>{{ chat.latest_message.content }}</p>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <div class="h-screen menu bg-base-100">
      <div class="mr-10 ml-3 mt-3">
        <h1 class="text-base-content">PEOPLE</h1>
        <div class="mt-3">
          <Search @search="onSearch" />
          <div>
            <ul v-for="user in users" :key="user.id">
              <div class="divider"></div>
              <li class="mt-5">
                <span class="badge hover:bg-base-300 text-base-content bg-base-200 h-10 w-full">{{
                  user.name
                }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Notification />
</template>
