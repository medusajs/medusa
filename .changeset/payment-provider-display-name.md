---
"@medusajs/payment": patch
"@medusajs/utils": patch
"@medusajs/types": patch
"@medusajs/medusa": patch
---

feat(payment,medusa): add optional display name to payment providers

Payment providers can now define a static `displayName`. It's persisted on the provider's new `display_name` field and returned by the store (`/store/payment-providers`) and admin (`/admin/payments/payment-providers`) APIs, so storefronts and the admin can show a human-readable label instead of only the provider id.
