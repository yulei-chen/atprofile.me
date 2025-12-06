<script setup lang="ts">
import type { AppBskyActorDefs } from '@atproto/api'
import { computed, ref, watch } from 'vue'

const { handle } = useHandle()
const { setLoading } = useLoading()
const { agent } = useAtproto()
const profile = ref<AppBskyActorDefs.ProfileViewDetailed | null>(null)

// Convert URLs in description to clickable links
const descriptionWithLinks = computed(() => {
  if (!profile.value?.description)
    return ''

  // Regex to match http/https links
  const urlRegex = /(https?:\/\/\S+)/g

  return profile.value.description.replace(urlRegex, (url) => {
    // Remove leading http:// or https://
    const displayText = url.replace(/^https?:\/\//, '')
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300">${displayText}</a>`
  })
})

async function fetchBlueskyProfile() {
  if (!handle.value) {
    throw new Error('Handle cannot be empty')
  }

  setLoading('profile', true)

  try {
    const result = await agent.getProfile({
      actor: handle.value,
    })

    if (result.data) {
      profile.value = result.data
    }
  }
  finally {
    setLoading('profile', false)
  }
}

watchEffect(() => {
  fetchBlueskyProfile()
})

watch(() => profile.value, (newProfile) => {
  useHead({
    title: newProfile?.displayName || 'atprofile',
  })
}, { immediate: true })
</script>

<template>
  <!-- User info -->
  <template v-if="profile">
    <!-- Avatar -->
    <div v-if="profile.avatar" mb-4>
      <img
        :src="profile.avatar"
        :alt="profile.displayName || handle || undefined"
        class="border-2 border-gray-300 rounded-full h-32 w-32 object-cover dark:border-gray-600"
      >
    </div>
    <div v-else mb-4>
      <div class="rounded-full bg-gray-300 flex h-32 w-32 items-center justify-center dark:bg-gray-700">
        <div i-carbon-user text-6xl op-50 />
      </div>
    </div>

    <!-- Display name -->
    <h1 v-if="profile.displayName" text-3xl font-bold mb-2 text-left>
      {{ profile.displayName }}
    </h1>

    <!-- Handle -->
    <div text-lg mb-4 text-left op-70>
      @{{ handle || '' }}
    </div>

    <!-- Description -->
    <div v-if="profile.description" class="mx-auto mb-6">
      <p class="text-left whitespace-pre-wrap" v-html="descriptionWithLinks" />
    </div>

    <Bluesky :description="profile.displayName" />
  </template>

  <template v-else>
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <div>Not found</div>
    <div>
      <NuxtLink to="/" text-sm btn m="3 t8">
        Back
      </NuxtLink>
    </div>
  </template>
</template>
