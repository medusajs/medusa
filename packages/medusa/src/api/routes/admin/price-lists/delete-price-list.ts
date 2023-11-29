import { WorkflowTypes } from "@medusajs/types"
import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { removePriceLists } from "@medusajs/core-flows"
import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"

/**
 * @oas [delete] /admin/price-lists/{id}
 * operationId: "DeletePriceListsPriceList"
 * summary: "Delete a Price List"
 * description: "Delete a Price List and its associated prices."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List.
 * x-codegen:
 *   method: delete
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.delete(priceListId)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/price-lists/{id}' \
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

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")
  const manager: EntityManager = req.scope.resolve("manager")

  const isMedusaV2FlagEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  if (isMedusaV2FlagEnabled) {
    const removePriceListsWorkflow = removePriceLists(req.scope)

    const input = {
      price_lists: [id],
    } as WorkflowTypes.PriceListWorkflow.RemovePriceListWorkflowInputDTO

    await removePriceListsWorkflow.run({
      input,
      context: {
        manager,
      },
    })
  } else {
    const priceListService: PriceListService =
      req.scope.resolve("priceListService")
    await manager.transaction(async (transactionManager) => {
      await priceListService.withTransaction(transactionManager).delete(id)
    })
  }

  res.json({
    id,
    object: "price-list",
    deleted: true,
  })
}
