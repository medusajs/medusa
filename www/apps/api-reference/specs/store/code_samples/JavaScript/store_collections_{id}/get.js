import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.collections.retrieve(collectionId)
.then(({ collection }) => {
  console.log(collection.id);
})
