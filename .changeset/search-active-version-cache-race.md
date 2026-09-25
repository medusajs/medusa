---
"@medusajs/search": patch
---

fix(search): stop the active version cache from undoing an index flip. Setting or invalidating an entry now waits for a refresh in flight to land first, so a refresh that read the database before the flip can no longer drop or roll it back
