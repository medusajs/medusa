import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { removePriceListVariantPrices } from "@medusajs/core-flows"
import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"
import { WorkflowTypes } from "@medusajs/types"

/**
 * @oas [delete] /admin/price-lists/{id}/variants/{variant_id}/prices
 * operationId: "DeletePriceListsPriceListVariantsVariantPrices"
 * summary: "Delete a Variant's Prices"
 * description: "Delete all the prices related to a specific variant in a price list."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
 *   - (path) variant_id=* {string} The ID of the variant.
 * x-codegen:
 *   method: deleteVariantPrices
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.deleteVariantPrices(priceListId, variantId)
 *       .then(({ ids, object, deleted }) => {
 *         console.log(ids);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/price-lists/{id}/variants/{variant_id}/prices' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const manager: EntityManager = req.scope.resolve("manager")

  const isMedusaV2FlagEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  let deletedPriceIds: string[] = []

  if (isMedusaV2FlagEnabled) {
    const deletePriceListProductsWorkflow = removePriceListVariantPrices(
      req.scope
    )

    const input = {
      variant_ids: [variant_id],
      price_list_id: id,
    } as WorkflowTypes.PriceListWorkflow.RemovePriceListVariantsWorkflowInputDTO

    const { result } = await deletePriceListProductsWorkflow.run({
      input,
      context: {
        manager,
      },
    })
    deletedPriceIds = result
  } else {
    const [deletedIds] = await manager.transaction(
      async (transactionManager) => {
        return await priceListService
          .withTransaction(transactionManager)
          .deleteVariantPrices(id, [variant_id])
      }
    )

    deletedPriceIds = deletedIds
  }

  return res.json({
    ids: deletedPriceIds,
    object: "money-amount",
    deleted: true,
  })
}
