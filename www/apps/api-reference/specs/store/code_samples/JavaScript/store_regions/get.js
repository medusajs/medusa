import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.regions.list()
.then(({ regions }) => {
  console.log(regions.length);
});
