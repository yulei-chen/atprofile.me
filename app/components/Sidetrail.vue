<script setup lang="ts">
import { computed } from 'vue'

const { handle } = useHandle()
const { setLoading } = useLoading()
const { collections, fetchRepoDescription } = useRepo()

// Check if sidetrail collections exist using string matching
const hasSidetrailData = computed(() => {
  return collections.value.some((collection: string) => collection.startsWith('app.sidetrail'))
})

watchEffect(async () => {
  if (handle.value) {
    setLoading('sidetrail', true)
    await fetchRepoDescription()
    setLoading('sidetrail', false)
  }
})
</script>

<template>
  <template v-if="hasSidetrailData">
    <!-- Show Card if any collection has data -->
    <Card
      src="https://www.google.com/s2/favicons?sz=128&domain=sidetrail.app"
      :description="handle || ''"
      :link="`https://sidetrail.app/@${handle || ''}`"
    />
  </template>
</template>
