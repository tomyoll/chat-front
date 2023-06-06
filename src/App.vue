<script setup>
import { RouterView } from 'vue-router'
import SideBar from './components/SideBar.component.vue'
import Notification from './components/AlertNotification.component.vue'
import { useAuthStore } from './stores/auth'
import cableService from './services/cable.service'

import { onMounted } from 'vue'
import { themeChange } from 'theme-change'

onMounted(() => {
  themeChange(false)
})

const store = useAuthStore()

store.$subscribe(
  () => {
    if (store.user) {
      cableService.connect()
    }
  },
  { detached: true }
)
</script>

<template>
  <div class="h-full relative z-1 box-border block overflow-hidden">
    <SideBar />
    <div class="flex flex-col box-border ml-72">
      <RouterView />
    </div>
    <Notification />
  </div>
</template>
