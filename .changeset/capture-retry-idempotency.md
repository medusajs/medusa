---
"@medusajs/payment": patch
---

fix(payment): retrying a capture after a provider-side failure reuses the same idempotency key, and rotates it if the reused key fails again so deterministic provider failures can still converge
