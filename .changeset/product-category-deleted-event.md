---
"@medusajs/product": patch
---

fix(product): emit `product.product-category.deleted` when soft-deleting product categories so subscribers using `ProductEvents.PRODUCT_CATEGORY_DELETED` are triggered
