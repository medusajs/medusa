import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache"

export default defineCloudflareConfig({
  // Persist ISR / unstable_cache entries in R2 (they are no-ops without a
  // backing store), with a per-datacenter Cache API layer on top so repeat
  // requests in a region don't hit R2 at all.
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: "long-lived",
  }),
})
