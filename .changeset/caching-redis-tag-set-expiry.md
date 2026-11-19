---
"@medusajs/caching-redis": patch
---

fix(caching-redis): never shorten a tag set's expiry when a shorter-lived entry is added, so longer-lived entries stay reachable for tag invalidation
