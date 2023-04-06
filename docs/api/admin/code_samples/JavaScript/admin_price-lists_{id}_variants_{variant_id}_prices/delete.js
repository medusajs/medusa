import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.priceLists.deleteVariantPrices(price_list_id, variant_id)
.then(({ ids, object, deleted }) => {
  console.log(ids);
});
