---
"@medusajs/core-flows": patch
---

Delete custom links created with `ProductModule.linkable.productVariant` when running `deleteProductVariantsWorkflow`, while preserving native links that use `variant_id`. Restore both link types when the workflow compensates.
