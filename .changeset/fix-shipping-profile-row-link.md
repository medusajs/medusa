---
"@medusajs/dashboard": patch
---

fix(dashboard): correct shipping profile row link to avoid 404

With `view_configurations` enabled, clicking a row in Settings → Locations & Shipping → Shipping Profiles navigated to `/settings/shipping-profiles/:id`, which isn't a registered route. Corrected `getRowHref` to `/settings/locations/shipping-profiles/:id`, matching every other reference to this route in the same feature.
