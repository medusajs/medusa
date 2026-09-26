---
"@medusajs/dashboard": patch
---

fix(dashboard): correct shipping profile row link path

The configurable shipping profile list table's `getRowHref` built `/settings/shipping-profiles/:id`, which 404s, instead of `/settings/locations/shipping-profiles/:id`, where the route is actually registered. Clicking a row in the shipping profiles list now navigates correctly.
