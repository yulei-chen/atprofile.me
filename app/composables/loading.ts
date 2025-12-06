import { computed, ref } from 'vue'

// Global singleton state, ensuring all components share the same loading state
const loadingStates = ref<Record<string, boolean>>({
  profile: false,
  leaflet: false,
  tangled: false,
  sidetrail: false,
})

/**
 * Unified data loading state management
 * Coordinates loading states across all components to enable skeleton page functionality
 * Uses singleton pattern to ensure all components share the same state
 */
export function useLoading() {
  /**
   * Set loading state for a specific component
   */
  function setLoading(key: keyof typeof loadingStates.value, loading: boolean) {
    loadingStates.value[key] = loading
  }

  /**
   * Check if all data has finished loading
   */
  const isAllLoaded = computed(() => {
    return Object.values(loadingStates.value).every(loading => !loading)
  })

  /**
   * Check if any data is currently loading
   */
  const isLoading = computed(() => {
    return Object.values(loadingStates.value).some(loading => loading)
  })

  /**
   * Reset all loading states
   * Set all states to true, indicating loading is needed
   * Components will set their state to false after loading completes
   */
  function resetLoading() {
    Object.keys(loadingStates.value).forEach((key) => {
      loadingStates.value[key as keyof typeof loadingStates.value] = true
    })
  }

  return {
    loadingStates,
    setLoading,
    isAllLoaded,
    isLoading,
    resetLoading,
  }
}
