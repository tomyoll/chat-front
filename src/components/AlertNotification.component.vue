<script setup>
import { useNotificationStore } from '../stores/notification'
import { computed, ref } from 'vue'

const notificationStore = useNotificationStore()

const notificationToRender = computed(() => {
  return notificationStore.GET_ALL.slice(0, 3)
})

const tickTimeout = ref(setTimeout(() => {}, 0))

const tick = (/** @type {number} */ index) => {
  if (index !== 0) return
  clearTimeout(tickTimeout.value)
  tickTimeout.value = setTimeout(() => notificationStore.REMOVE(index), 3000)
}
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 top-28 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center sm:items-end">
      <TransitionGroup
        enter-active-class="transform ease-in-out duration-300 transition-all"
        enter-from-class="opacity-0 scale-50"
        enter-to-class="opacity-100"
        leave-active-class="transform transition-all ease-out duration-500"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-1/2 opacity-0"
      >
        <div
          v-for="(notification, index) in notificationToRender"
          :key="notification.id"
          class="pointer-events-auto absolute w-full max-w-sm -translate-y-3/4 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 ease-in-out"
          :class="{
            'z-10 -translate-y-[25%] scale-75 blur-[2px]': index === 2,
            'z-20 -translate-y-[50%] scale-90 blur-[2px]': index === 1,
            'z-30 scale-100 opacity-100': index === 0
          }"
          @transitionstart="tick(index)"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="notification.type === 'success'"
                  class="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
                <ExclamationCircleIcon
                  v-else-if="notification.type === 'error'"
                  class="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
                <InformationCircleIcon v-else class="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div> -->
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-warning">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="notificationStore.REMOVE(index)"
                >
                  <span class="sr-only">Close</span>
                  <!-- <XMarkIcon class="h-5 w-5" aria-hidden="true" /> -->
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
