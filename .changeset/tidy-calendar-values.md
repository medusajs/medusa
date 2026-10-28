---
"@medusajs/ui": patch
---

Fix Calendar and DatePicker keeping their previous date and time when their controlled value changes. Preserve the previous object when the fields are unchanged to avoid repeated change notifications.
