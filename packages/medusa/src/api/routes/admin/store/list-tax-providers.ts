import { TaxProviderService } from "../../../../services"

/**
 * @oas [get] /admin/store/tax-providers
 * operationId: "GetStoreTaxProviders"
 * summary: "List Tax Providers"
 * description: "Retrieve a list of available Tax Providers in a store."
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
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminStoreTaxProviders } from "medusa-react"
 *
 *       const TaxProviders = () => {
 *         const {
 *           tax_providers,
 *           isLoading
 *         } = useAdminStoreTaxProviders()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {tax_providers && !tax_providers.length && (
 *               <span>No Tax Providers</span>
 *             )}
 *             {tax_providers &&
 *               tax_providers.length > 0 &&(
 *                 <ul>
 *                   {tax_providers.map((provider) => (
 *                     <li key={provider.id}>{provider.id}</li>
 *                   ))}
 *                 </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default TaxProviders
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/store/tax-providers' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
