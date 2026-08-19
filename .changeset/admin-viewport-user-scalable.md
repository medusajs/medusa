---
"@medusajs/admin-bundler": patch
---

fix(admin-bundler): allow zooming in the generated admin HTML

The viewport meta tag written to `.medusa/client/index.html` set `user-scalable=no`, which blocked pinch-to-zoom and browser zoom in the admin dashboard and failed WCAG 1.4.4.
