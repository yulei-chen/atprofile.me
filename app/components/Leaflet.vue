<script setup lang="ts">
import { ref, watch } from 'vue'

interface Publication {
  uri: string
  cid: string
  name?: string
  content?: string
  text?: string
  base_path?: string
  [key: string]: any
}

const { handle } = useHandle()
const { setLoading } = useLoading()
const { repoAgent } = useAtproto()
const publications = ref<Publication[]>([])

async function fetchPublications() {
  setLoading('leaflet', true)

  try {
    const result = await repoAgent.com.atproto.repo.listRecords({
      repo: handle.value,
      collection: 'pub.leaflet.publication',
      limit: 50,
    })

    if (result.data?.records) {
      publications.value = result.data.records.map(record => ({
        ...record.value,
        uri: record.uri,
        cid: record.cid,
      })) as Publication[]
    }
    else {
      publications.value = []
    }
  }
  finally {
    setLoading('leaflet', false)
  }
}

watchEffect(() => {
  if (handle.value) {
    fetchPublications()
  }
})

// Format publication text
function formatPublicationText(publication: any): string {
  // Leaflet publication may contain title and content
  if (publication.name) {
    return publication.name
  }
  if (publication.content) {
    // Extract plain text if HTML or Markdown
    const text = publication.content.replace(/<[^>]*>/g, '').trim()
    return text || 'No title'
  }
  if (publication.text) {
    return publication.text
  }
  return 'No content'
}

// eg, https://underreacted.leaflet.pub/
function getPublicationLink(publication: any): string {
  return `https://${publication.base_path}`
}
</script>

<template>
  <template v-if="publications.length > 0">
    <Card
      v-for="(publication, index) in publications"
      :key="publication.uri || publication.cid || index"
      src="https://www.google.com/s2/favicons?sz=128&domain=leaflet.pub"
      :description="formatPublicationText(publication)"
      :link="getPublicationLink(publication)"
    />
  </template>
</template>
