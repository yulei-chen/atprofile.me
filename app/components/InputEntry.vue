<script setup lang="ts">
const { handle } = useHandle()

const router = useRouter()

function go() {
  if (handle.value.trim()) {
    // Remove any existing @ prefix, then add @ prefix
    const cleanHandle = handle.value.trim().replace(/^@+/, '')
    if (cleanHandle) {
      router.push(`/@${encodeURIComponent(cleanHandle)}`)
    }
  }
}
</script>

<template>
  <div>
    <div class="inline-block relative">
      <span class="text-gray-400 pointer-events-none left-4 top-1/2 absolute dark:text-gray-400 -translate-y-1/2">
        @
      </span>
      <input
        id="input"
        v-model="handle"
        placeholder="alice.bsky.social"
        type="text"
        class="px-4 px-8 py-2 outline-none border border-gray-200 rounded bg-transparent w-[250px] focus:outline-none dark:border-gray-700"
        @keydown.enter="go"
      >
      <button
        i-carbon-arrow-right
        class="text-gray-400 right-4 top-1/2 absolute dark:text-gray-400 -translate-y-1/2"
        :disabled="!handle.trim()"
        @click="go"
      />
    </div>
    <div>
      <span class="text-sm text-gray-500">
        Enter with your <a href="https://internethandle.org/#start" target="_blank" class="underline">internet handle</a>
      </span>
    </div>
  </div>
</template>
