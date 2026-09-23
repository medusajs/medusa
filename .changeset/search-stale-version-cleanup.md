---
"@medusajs/search": patch
---

fix(search): stop search index versions from piling up. A reindex drops the versions earlier failed or interrupted rebuilds left above the active one, and a swap drops every version below the new active one except its predecessor, instead of leaving them until the next build
