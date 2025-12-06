<script setup lang="ts">
import { ref, watch } from 'vue'

interface TangledProfile {
  uri: string
  cid: string
  value?: {
    handle?: string
    displayName?: string
    [key: string]: any
  }
  [key: string]: any
}

const { handle } = useHandle()
const { setLoading } = useLoading()
const { repoAgent } = useAtproto()
const data = ref<TangledProfile | null>(null)

async function fetchTangledProfile() {
  setLoading('tangled', true)

  try {
    const result = await repoAgent.com.atproto.repo.getRecord({
      repo: handle.value,
      collection: 'sh.tangled.actor.profile',
      rkey: 'self',
    })

    if (result.data) {
      data.value = {
        uri: result.data.uri,
        cid: result.data.cid || '',
        value: result.data.value as any,
      }
    }
    else {
      data.value = null
    }
  }
  finally {
    setLoading('tangled', false)
  }
}

watchEffect(() => {
  if (handle.value) {
    fetchTangledProfile()
  }
})
</script>

<template>
  <template v-if="data?.value">
    <!-- Only show when Tangled profile exists -->
    <Card
      src="https://cdn.bsky.app/img/avatar/plain/did:plc:wshs7t2adsemcrrd4snkeqli/bafkreif6z53z4ukqmdgwstspwh5asmhxheblcd2adisoccl4fflozc3kva@jpeg"
      :description="handle || ''"
      :link="`https://tangled.org/${handle || ''}`"
    />
  </template>
</template>
