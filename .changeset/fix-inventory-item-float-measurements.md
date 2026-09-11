---
"@medusajs/inventory": patch
"@medusajs/dashboard": patch
---

fix(inventory): allow floating-point values for inventory item measurements

Changed the inventory item model's weight, length, height, and width
properties from `model.number()` (integer) to `model.float()`, aligning
them with the product and product-variant models that already use float.

Includes a database migration to alter the columns from `int` to `real`,
updates the admin dashboard's create-inventory-item form schema from
`optionalInt` to `optionalFloat`, and adds `step="any"` to all
measurement input fields in both the create and edit forms so the browser
allows decimal input.
