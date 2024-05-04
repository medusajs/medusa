import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
medusa.returnReasons.retrieve(reasonId)
.then(({ return_reason }) => {
  console.log(return_reason.id);
})
