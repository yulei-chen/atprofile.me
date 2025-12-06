import { AtpAgent } from '@atproto/api'

/**
 * Create and return BskyAgent instances
 * Provides two different agents:
 * - bskyAgent: For app.bsky.* API (https://public.api.bsky.app)
 * - repoAgent: For com.atproto.repo.* API (https://bsky.social)
 */
export function useAtproto() {
  // Agent for app.bsky.* API
  const bskyAgent = new AtpAgent({
    service: 'https://public.api.bsky.app',
  })

  // Agent for com.atproto.repo.* API
  const repoAgent = new AtpAgent({
    service: 'https://bsky.social',
  })

  return {
    // Default to bskyAgent (for backward compatibility)
    agent: bskyAgent,
    bskyAgent,
    repoAgent,
  }
}
