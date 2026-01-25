import type { AppBskyActorDefs } from '@atproto/api'

export function useHandleSearch() {
  const { bskyAgent } = useAtproto()
  const suggestions = ref<AppBskyActorDefs.ProfileView[]>([])
  const isSearching = ref(false)
  const searchQuery = ref('')

  async function searchHandles(query: string) {
    if (!query || query.trim().length < 2) {
      suggestions.value = []
      return
    }

    // Remove @ prefix if present
    const cleanQuery = query.trim().replace(/^@+/, '')

    if (cleanQuery.length < 2) {
      suggestions.value = []
      return
    }

    isSearching.value = true
    searchQuery.value = cleanQuery

    try {
      const result = await bskyAgent.searchActors({
        q: cleanQuery,
        limit: 8,
      })

      if (result.data?.actors) {
        suggestions.value = result.data.actors as AppBskyActorDefs.ProfileView[]
      }
    }
    catch (error) {
      console.error('Error searching handles:', error)
      suggestions.value = []
    }
    finally {
      isSearching.value = false
    }
  }

  // Debounced search function
  const debouncedSearch = useDebounceFn(searchHandles, 300)

  function clearSuggestions() {
    suggestions.value = []
    searchQuery.value = ''
  }

  return {
    suggestions,
    isSearching,
    searchQuery,
    searchHandles: debouncedSearch,
    clearSuggestions,
  }
}
