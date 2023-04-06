import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.products.retrieve(product_id)
.then(({ product }) => {
  console.log(product.id);
});
