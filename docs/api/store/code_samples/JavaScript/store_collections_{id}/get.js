import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.collections.retrieve(collection_id)
.then(({ collection }) => {
  console.log(collection.id);
});
