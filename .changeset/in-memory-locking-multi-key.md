---
"@medusajs/locking": patch
---

fix(locking): in the in-memory provider, resume a multi-key acquisition from the key it waited on, take keys in a fixed order, and give back partially acquired keys when a call times out
