import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.returnReasons.list()
.then(({ return_reasons }) => {
  console.log(return_reasons.length);
});
