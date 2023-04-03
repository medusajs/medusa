import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.collections.list()
.then(({ collections, limit, offset, count }) => {
  console.log(collections.length);
});
