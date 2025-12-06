<script setup lang="ts">
import { computed, ref } from 'vue'

const { handle } = useHandle()
const { setLoading } = useLoading()

const { repoAgent } = useAtproto()
const completionRecords = ref<any[]>([])
const trailRecords = ref<any[]>([])
const walkRecords = ref<any[]>([])

async function fetchSidetrailData() {
  setLoading('sidetrail', true)

  try {
    // Fetch data from three collections in parallel
    const [completionResult, trailResult, walkResult] = await Promise.allSettled([
      repoAgent.com.atproto.repo.listRecords({
        repo: handle.value,
        collection: 'app.sidetrail.completion',
        limit: 1,
      }),
      repoAgent.com.atproto.repo.listRecords({
        repo: handle.value,
        collection: 'app.sidetrail.trail',
        limit: 1,
      }),
      repoAgent.com.atproto.repo.listRecords({
        repo: handle.value,
        collection: 'app.sidetrail.walk',
        limit: 1,
      }),
    ])

    completionRecords.value = completionResult.status === 'fulfilled' && completionResult.value.data?.records
      ? completionResult.value.data.records
      : []

    trailRecords.value = trailResult.status === 'fulfilled' && trailResult.value.data?.records
      ? trailResult.value.data.records
      : []

    walkRecords.value = walkResult.status === 'fulfilled' && walkResult.value.data?.records
      ? walkResult.value.data.records
      : []
  }
  catch (e) {
    completionRecords.value = []
    trailRecords.value = []
    walkRecords.value = []
    throw e
  }
  finally {
    setLoading('sidetrail', false)
  }
}

// Check if any collection has data
const hasSidetrailData = computed(() => {
  return (
    completionRecords.value.length > 0
    || trailRecords.value.length > 0
    || walkRecords.value.length > 0
  )
})

watchEffect(() => {
  if (handle.value) {
    fetchSidetrailData()
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
