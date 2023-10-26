import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.productCategories.list()
.then(({ product_categories, limit, offset, count }) => {
  console.log(product_categories.length);
});
