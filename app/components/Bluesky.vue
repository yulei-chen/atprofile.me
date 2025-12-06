<script setup lang="ts">
interface Props {
  description?: string
}

defineProps<Props>()

const { handle } = useHandle()
</script>

<template>
  <Card icon="i-logos-bluesky" :description="description" :link="`https://bsky.app/profile/${handle || ''}`" />
</template>
