---
"@medusajs/medusa": patch
---

fix(medusa): enforce product_id when deleting a product variant

DELETE `/admin/products/:id/variants/:variant_id` previously ignored the product id in the URL (product_id was commented out on the workflow input), so a variant could be deleted under the wrong product path and the response parent could be misleading. The handler now fetches the variant scoped by `{ id, product_id }` like GET, returns 404 when it is not under that product, then deletes.
