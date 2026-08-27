---
"@medusajs/dashboard": patch
---

fix(dashboard): link shipping profile rows to their registered route

The configurable shipping profiles table linked rows to `/settings/shipping-profiles/:id`, which is not a registered route, so clicking a row showed the admin SPA's "no page at this address". The detail route is registered under `locations`, matching the create form, the product shipping-profile section, and the delete redirect.
