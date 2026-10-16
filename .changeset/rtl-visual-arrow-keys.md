---
"@medusajs/dashboard": patch
---

fix(dashboard): follow the arrow's direction in RTL

The data grid, the category combobox and the product media gallery all read ArrowRight as "next" and ArrowLeft as "previous", which only holds in a left-to-right document. Under `dir="rtl"` the next item sits to the left, so in Persian, Arabic or Hebrew the focus moved against the arrow the user pressed.

The two horizontal arrows are now exchanged under RTL before the key is interpreted. ArrowUp and ArrowDown are unchanged, since only the inline axis flips, and nothing changes in LTR.
