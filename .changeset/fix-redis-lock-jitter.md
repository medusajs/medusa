---
"@medusajs/locking-redis": patch
---

fix(locking-redis): add jitter to Redis lock retry backoff to prevent contention spikes and use MedusaError convention
