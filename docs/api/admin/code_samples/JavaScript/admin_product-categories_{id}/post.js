import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.productCategories.update(product_category_id, {
  name: "Skinny Jeans"
})
.then(({ product_category }) => {
  console.log(product_category.id);
});
