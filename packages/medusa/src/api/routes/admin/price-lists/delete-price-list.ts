import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /admin/price-lists/{id}
 * operationId: "DeletePriceListsPriceList"
 * summary: "Delete a Price List"
 * description: "Deletes a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List to delete.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.delete(price_list_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/price-lists/{id}' \
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
 *           $ref: "#/components/schemas/AdminPriceListDeleteRes"
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
  const { id } = req.params

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await priceListService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "price-list",
    deleted: true,
  })
}
