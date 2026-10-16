---
"@medusajs/translation": patch
---

feat(translation): seed the Persian (Iran) locale

The default locale list seeded by the Translation Module included Arabic
and Hebrew but no Persian entry, so storefronts serving Iran had to create
`fa-IR` by hand before translating content. `fa-IR` is now part of the
defaults. The loader upserts by code, so existing installs pick it up on
the next start without duplicates.
