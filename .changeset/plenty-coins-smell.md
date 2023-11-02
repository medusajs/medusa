---
"@medusajs/admin-ui": patch
---

fix(admin-ui): Fixes an issue where regions were not scrollable in tax settings view, also adds a IntersectionObserver to ensure that we load all regions as the user scrolls. The current implementation was capped at loading 20 regions.
