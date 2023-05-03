---
"@medusajs/admin-ui": patch
---

fix(admin-ui): fixes an issue where navigating to tax settings would append the basename multiple times. Removes `react-helmet` for `react-helmet-async` to get rid off error caused by unsafe sideeffects"
