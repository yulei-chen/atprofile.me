import type { ComAtprotoRepoDescribeRepo } from '@atproto/api'
import { computed, ref, watch } from 'vue'

/**
 * Composable for managing repo descriptions and collection checks
 * Uses com.atproto.repo.describeRepo to get all collections in a repo
 * Uses shared state to avoid duplicate API calls
 */
export function useRepo() {
  const { repoAgent } = useAtproto()
  const { handle } = useHandle()

  // Shared state across all components using this composable
  const repoDescription = useState<ComAtprotoRepoDescribeRepo.OutputSchema | null>('repoDescription', () => null)
  const isLoading = useState<boolean>('repoLoading', () => false)
  // Store error message as string instead of Error object (Error objects cannot be serialized)
  const error = useState<string | null>('repoError', () => null)
  const lastFetchedHandle = useState<string | null>('lastFetchedHandle', () => null)
  // Use ref for Promise (not serializable, doesn't need to be shared across SSR/client)
  const fetchPromise = ref<Promise<void> | null>(null)

  /**
   * Fetch repo description which includes all collections
   * Only fetches if handle changed or data is not available
   * Returns a promise that resolves when fetch is complete (even if cached)
   */
  async function fetchRepoDescription(): Promise<void> {
    if (!handle.value) {
      repoDescription.value = null
      lastFetchedHandle.value = null
      return
    }

    // Skip if we already have data for this handle
    if (lastFetchedHandle.value === handle.value && repoDescription.value) {
      return
    }

    // If already loading, wait for the existing promise
    if (isLoading.value && fetchPromise.value) {
      return fetchPromise.value
    }

    // Create a new fetch promise
    const promise = (async () => {
      isLoading.value = true
      error.value = null

      try {
        const result = await repoAgent.com.atproto.repo.describeRepo({
          repo: handle.value,
        })

        if (result.data) {
          repoDescription.value = result.data
          lastFetchedHandle.value = handle.value
          error.value = null
        }
        else {
          repoDescription.value = null
          lastFetchedHandle.value = null
          error.value = null
        }
      }
      catch (e) {
        // Store error message as string (Error objects cannot be serialized)
        error.value = e instanceof Error ? e.message : String(e)
        repoDescription.value = null
        lastFetchedHandle.value = null
      }
      finally {
        isLoading.value = false
        fetchPromise.value = null
      }
    })()

    fetchPromise.value = promise
    return promise
  }

  // Watch handle changes and reset state when handle is cleared
  watch(handle, (newHandle) => {
    if (!newHandle) {
      repoDescription.value = null
      lastFetchedHandle.value = null
    }
  })

  /**
   * Get all collections from the repo description
   */
  const collections = computed(() => {
    return repoDescription.value?.collections || []
  })

  /**
   * Check if a specific collection exists in the repo
   * @param collectionPrefix - The prefix to match (e.g., "app.sidetrail", "sh.tangled")
   * @returns true if any collection starts with the prefix
   */
  function hasCollection(collectionPrefix: string): boolean {
    if (!collections.value.length) {
      return false
    }
    return collections.value.some((collection: string) => collection.startsWith(collectionPrefix))
  }

  /**
   * Get all collections that match a prefix
   * @param collectionPrefix - The prefix to match
   * @returns Array of matching collection names
   */
  function getCollectionsByPrefix(collectionPrefix: string): string[] {
    if (!collections.value.length) {
      return []
    }
    return collections.value.filter((collection: string) => collection.startsWith(collectionPrefix))
  }

  return {
    repoDescription,
    collections,
    isLoading,
    error,
    fetchRepoDescription,
    hasCollection,
    getCollectionsByPrefix,
  }
}
