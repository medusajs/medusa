import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.shippingProfiles.list()
.then(({ shipping_profiles }) => {
  console.log(shipping_profiles.length);
});
