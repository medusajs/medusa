---
"@medusajs/dashboard": patch
---

Fix Rules of Hooks violation in the admin sidebar `NavItem`. `useTranslation`
was called inside `items.map()` (suppressed with an
`eslint-disable react-hooks/rules-of-hooks`), so the number of hooks rendered by
`NavItem` varied with the sub-item list length and the dashboard crashed with
"Rendered more hooks than during the previous render" whenever the menu changed
at runtime. The mapped row is extracted into a `NavItemSubItem` component that
owns its own `useTranslation` call.
