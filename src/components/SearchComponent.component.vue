<template>
  <label class="relative">
    <input
      type="search"
      placeholder="search..."
      class="input w-full bg-base text-base-content"
      @keyup="onKeyUp"
      @keyup.enter="search"
      v-model.trim="settings.text"
    />

    <button type="button" aria-label="Search" class="absolute top-[1%] right-4" @click="search">
      <img class="w-5 h-" src="../assets/search.svg" />
    </button>
  </label>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const settings = ref({
  delay: 500,
  time: null,
  text: '',
  lastText: ''
})

function clear() {
  if (settings.value.time) {
    clearTimeout(settings.value.time)
  }
}

function onKeyUp() {
  clear()

  settings.value.time = setTimeout(search, settings.value.time)
}

function search() {
  clear()

  // for not send same search
  if (settings.value.text === settings.value.lastText) {
    return
  }

  settings.value.lastText = settings.value.text

  emit('search', { text: settings.value.text })
}
</script>
