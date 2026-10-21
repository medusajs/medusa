---
"@medusajs/utils": patch
---

fix(utils): skip running or reverting module migrations when the module has no migrations folder, so `db:migrate` no longer writes to disk and works on read-only filesystems
