---
"@medusajs/payment": patch
---

Fix: retrying a payment capture after a provider-side failure now reuses the original idempotency key instead of minting a new one, preventing a double capture on ambiguous failures like network timeouts.
