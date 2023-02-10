import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.regions.retrieveFulfillmentOptions(region_id)
.then(({ fulfillment_options }) => {
  console.log(fulfillment_options.length);
});
