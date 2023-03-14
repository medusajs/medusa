import { TaxProviderService } from "../../../../services"

/**
 * @oas [get] /store/tax-providers
 * operationId: "GetStoreTaxProviders"
 * summary: "List Tax Providers"
 * description: "Retrieves the configured Tax Providers"
 * x-authenticated: true
 * x-codegen:
 *   method: listTaxProviders
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.store.listTaxProviders()
 *       .then(({ tax_providers }) => {
 *         console.log(tax_providers.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/store/tax-providers' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminTaxProvidersList"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const taxProviderService: TaxProviderService =
    req.scope.resolve("taxProviderService")
  const taxProviders = await taxProviderService.list()
  res.status(200).json({ tax_providers: taxProviders })
}
