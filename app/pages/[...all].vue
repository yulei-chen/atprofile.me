<script setup lang="ts">
const route = useRoute()
const { handle, setHandle } = useHandle()
const { isAllLoaded, resetLoading } = useLoading()

function extractHandle(path: string): string {
  const parts = path.split('/') // eg, https://atprofile.me/@alice.bsky.social
  const found = parts.find(p => p.startsWith('@'))
  if (!found)
    return ''
  // remove "@" prefix
  return found.slice(1)
}

watch(() => route.path, () => {
  const h = extractHandle(route.path)
  if (h) {
    // Reset loading states first, ensuring all states are true (indicating loading needed)
    resetLoading()
    // Then set handle, triggering component watches to start loading data
    setHandle(h)
  }
}, { immediate: true })
</script>

<template>
  <main class="mx-auto max-w-[380px]" text="dark:gray-200">
    <template v-if="handle">
      <!-- Show skeleton page until all data is loaded -->
      <Skeleton v-show="!isAllLoaded" />

      <!-- Show actual content after all data is loaded -->
      <!-- Always render components to initiate data requests, but use v-show to control visibility -->
      <div v-show="isAllLoaded" space-y-4>
        <Profile />
        <Leaflet />
        <Tangled />
        <Sidetrail />
      </div>
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
  </main>
</template>
