import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /price-lists/{id}/products/{product_id}/prices
 * operationId: "DeletePriceListsPriceListProductsProductPrices"
 * summary: "Delete Product's Prices"
 * description: "Delete all the prices related to a specific product in a price list"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List that the Money Amounts that will be deleted belongs to.
 *   - (path) product_id=* {string} The ID of the product from which the money amount will be deleted.
 * x-codegen:
 *   method: deleteProductPrices
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.deleteProductPrices(price_list_id, product_id)
 *       .then(({ ids, object, deleted }) => {
 *         console.log(ids.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/price-lists/{id}/products/{product_id}/prices' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Price List
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListDeleteProductPricesRes"
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
  const { id, product_id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")

  const manager: EntityManager = req.scope.resolve("manager")
  const [deletedPriceIds] = await manager.transaction(
    async (transactionManager) => {
      return await priceListService
        .withTransaction(transactionManager)
        .deleteProductPrices(id, [product_id])
    }
  )

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}
