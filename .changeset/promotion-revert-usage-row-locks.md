---
"@medusajs/promotion": patch
---

fix(promotion): serialize revertUsage with the same row locks as registerUsage so a concurrent revert cannot clobber a registration's usage increment
