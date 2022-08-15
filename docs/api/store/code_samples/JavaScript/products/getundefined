import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.products.list()
.then(({ products, limit, offset, count }) => {
  console.log(products.length);
});
