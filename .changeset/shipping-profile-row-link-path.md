---
"@medusajs/dashboard": patch
---

fix(dashboard): correct shipping profile row link path

The shipping profiles list linked rows to `/settings/shipping-profiles/:id`, which is not a registered route, so clicking a row landed on the admin SPA's not-found page. The detail route is registered under `locations` in `get-route.map.tsx`, so rows now link to `/settings/locations/shipping-profiles/:id` — matching the other call sites that already use that path (`default-search-entities.ts`, `product-shipping-profile-section.tsx`, and `create-shipping-profile-form.tsx`).
