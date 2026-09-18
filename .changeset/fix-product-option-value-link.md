---
"@medusajs/product": patch
---

fix: link product option values added to existing product options

Adding a value to an existing product option created the value but did not create the corresponding product link, making it invisible in the admin and product graph. Newly added values are now linked to the product.
