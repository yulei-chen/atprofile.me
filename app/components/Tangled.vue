<script setup lang="ts">
import { computed } from 'vue'

const { handle } = useHandle()
const { setLoading } = useLoading()
const { hasCollection, fetchRepoDescription } = useRepo()

// Check if tangled collections exist using string matching
const hasTangledData = computed(() => {
  return hasCollection('sh.tangled')
})

watchEffect(async () => {
  if (handle.value) {
    setLoading('tangled', true)
    await fetchRepoDescription()
    setLoading('tangled', false)
  }
})
</script>

<template>
  <template v-if="hasTangledData">
    <!-- Only show when Tangled collections exist -->
    <Card
      src="https://cdn.bsky.app/img/avatar/plain/did:plc:wshs7t2adsemcrrd4snkeqli/bafkreif6z53z4ukqmdgwstspwh5asmhxheblcd2adisoccl4fflozc3kva@jpeg"
      :description="handle || ''"
      :link="`https://tangled.org/${handle || ''}`"
    />
  </template>
</template>
