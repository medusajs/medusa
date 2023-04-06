import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.products.search({
  q: 'Shirt'
})
.then(({ hits }) => {
  console.log(hits.length);
});
