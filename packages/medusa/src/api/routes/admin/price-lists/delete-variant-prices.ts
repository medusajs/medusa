import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /admin/price-lists/{id}/variants/{variant_id}/prices
 * operationId: "DeletePriceListsPriceListVariantsVariantPrices"
 * summary: "Delete Variant's Prices"
 * description: "Delete all the prices related to a specific variant in a price list"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List that the Money Amounts that will be deleted belongs to.
 *   - (path) variant_id=* {string} The ID of the variant from which the money amount will be deleted.
 * x-codegen:
 *   method: deleteVariantPrices
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.deleteVariantPrices(price_list_id, variant_id)
 *       .then(({ ids, object, deleted }) => {
 *         console.log(ids);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/price-lists/{id}/variants/{variant_id}/prices' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Price Lists
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListDeleteVariantPricesRes"
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
  const { id, variant_id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const manager: EntityManager = req.scope.resolve("manager")
  const [deletedPriceIds] = await manager.transaction(
    async (transactionManager) => {
      return await priceListService
        .withTransaction(transactionManager)
        .deleteVariantPrices(id, [variant_id])
    }
  )

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}
