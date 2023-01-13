import Medusa from "@medusajs/medusa-js"
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
// must be previously logged in or use api token
medusa.admin.publishableApiKeys.update(publishableApiKeyId, {
  title: "new title"
})
.then(({ publishable_api_key }) => {
  console.log(publishable_api_key.id)
})
