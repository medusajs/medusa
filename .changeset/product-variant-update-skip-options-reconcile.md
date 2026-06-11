---
"@medusajs/product": patch
---

perf(product): skip option resolution/validation/reconcile on scalar-only variant updates

`updateVariants_` loaded every variant of the product (with options) and ran the
option-uniqueness validation + relation reconcile on every update, even when no
options were changing. This is O(the product's total variant count) and synchronous,
making scalar-only updates on products with many variants block the event loop for
tens of seconds. The option work is now only performed when the payload actually
changes options.
