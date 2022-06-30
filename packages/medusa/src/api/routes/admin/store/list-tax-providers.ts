import { TaxProviderService } from "../../../../services"

/**
 * @oas [get] /store/tax-providers
 * operationId: "GetStoreTaxProviders"
 * summary: "Retrieve configured Tax Providers"
 * description: "Retrieves the configured Tax Providers"
 * x-authenticated: true
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             tax_providers:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/store"
 */
export default async (req, res) => {
  const taxProviderService: TaxProviderService =
    req.scope.resolve("taxProviderService")
  const taxProviders = await taxProviderService.list()
  res.status(200).json({ tax_providers: taxProviders })
}
