---
"@medusajs/core-flows": patch
"@medusajs/utils": patch
---

fix(core-flows, utils): import region prices correctly from product CSVs made by the export

The import now reads the "Variant Price <Region> [<CUR>]" columns the export writes and links each price to its region, instead of saving it with a currency like "[usd]".
