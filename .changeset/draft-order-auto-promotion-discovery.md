---
"@medusajs/core-flows": patch
---

fix(core-flows): discover the first eligible automatic promotion on draft order edits. `computeDraftOrderAdjustmentsWorkflow` no longer skips promotion computation when no promotion is attached to the draft order, and it reconciles the draft order's promotions with the computation result so newly eligible automatic promotions are attached (and no-longer-eligible ones detached). The draft order item and shipping method mutation workflows now always refresh adjustments instead of only when a promotion code is already attached.
