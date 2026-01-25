<script setup lang="ts">
const { handle } = useHandle()
const { suggestions, isSearching, searchHandles, clearSuggestions } = useHandleSearch()

const router = useRouter()
const inputRef = ref<HTMLInputElement>()
const showSuggestions = ref(false)
const selectedIndex = ref(-1)

// Watch handle changes and trigger search
watch(handle, (newValue) => {
  if (newValue && newValue.trim().length >= 2) {
    searchHandles(newValue)
    showSuggestions.value = true
    selectedIndex.value = -1
  }
  else {
    clearSuggestions()
    showSuggestions.value = false
  }
})

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (!showSuggestions.value || suggestions.value.length === 0) {
    if (event.key === 'Enter') {
      go()
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        selectHandle(suggestions.value[selectedIndex.value].handle)
      }
      else {
        go()
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      inputRef.value?.blur()
      break
  }
}

function selectHandle(selectedHandle: string) {
  handle.value = selectedHandle
  showSuggestions.value = false
  selectedIndex.value = -1
  clearSuggestions()
  // Navigate immediately after selection
  go()
}

function go() {
  if (handle.value.trim()) {
    // Remove any existing @ prefix, then add @ prefix
    const cleanHandle = handle.value.trim().replace(/^@+/, '')
    if (cleanHandle) {
      showSuggestions.value = false
      clearSuggestions()
      router.push(`/@${encodeURIComponent(cleanHandle)}`)
    }
  }
}

// Close suggestions when clicking outside
onClickOutside(inputRef, () => {
  showSuggestions.value = false
})
</script>

<template>
  <div>
    <div class="inline-block relative">
      <span class="text-gray-400 pointer-events-none left-4 top-1/2 absolute dark:text-gray-400 -translate-y-1/2">
        @
      </span>
      <input
        id="input"
        ref="inputRef"
        v-model="handle"
        placeholder="alice.bsky.social"
        type="text"
        class="px-4 px-8 py-2 outline-none border border-gray-200 rounded bg-transparent w-[250px] focus:outline-none dark:border-gray-700"
        autocomplete="off"
        @keydown="handleKeydown"
        @focus="showSuggestions = suggestions.length > 0"
      >
      <button
        i-carbon-arrow-right
        class="text-gray-400 right-4 top-1/2 absolute dark:text-gray-400 -translate-y-1/2"
        :disabled="!handle.trim()"
        @click="go"
      />
      <!-- Autocomplete dropdown -->
      <div
        v-if="showSuggestions && suggestions.length > 0"
        class="mt-1 border border-gray-200 rounded bg-white max-h-64 w-[250px] shadow-lg left-0 top-full absolute z-50 overflow-y-auto dark:border-gray-700 dark:bg-gray-800"
      >
        <div
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.did"
          class="px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-100 dark:bg-gray-700': selectedIndex === index }"
          @click="selectHandle(suggestion.handle)"
        >
          <div class="flex gap-2 items-center">
            <img
              v-if="suggestion.avatar"
              :src="suggestion.avatar"
              :alt="suggestion.displayName || suggestion.handle"
              class="rounded-full h-8 w-8"
            >
            <div
              v-else
              class="rounded-full bg-gray-300 flex h-8 w-8 items-center justify-center dark:bg-gray-600"
            >
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ (suggestion.displayName || suggestion.handle)[0].toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-gray-900 font-medium truncate dark:text-gray-100">
                {{ suggestion.displayName || suggestion.handle }}
              </div>
              <div class="text-xs text-gray-500 truncate dark:text-gray-400">
                @{{ suggestion.handle }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <span class="text-sm text-gray-500">
        Enter with your <a href="https://internethandle.org/#start" target="_blank" class="underline">internet handle</a>
      </span>
    </div>
  </div>
</template>
