---
"@medusajs/caching": patch
---

fix(caching): stop running cache invalidation as an event bus interceptor, so each event is invalidated once by the subscriber instead of also in the emitting process
