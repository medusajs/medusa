import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.regions.retrieve(region_id)
.then(({ region }) => {
  console.log(region.id);
});
