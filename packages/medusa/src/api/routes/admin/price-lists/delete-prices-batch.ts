import { FlagRouter, MedusaV2Flag } from "@medusajs/utils"
import { ArrayNotEmpty, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import PriceListService from "../../../../services/price-list"
import { validator } from "../../../../utils/validator"
import { WorkflowTypes } from "@medusajs/types"
import { removePriceListPrices } from "@medusajs/core-flows"

/**
 * @oas [delete] /admin/price-lists/{id}/prices/batch
 * operationId: "DeletePriceListsPriceListPricesBatch"
 * summary: "Delete Prices"
 * description: "Delete a list of prices in a Price List"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Price List
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDeletePriceListPricesPricesReq"
 * x-codegen:
 *   method: deletePrices
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.priceLists.deletePrices(priceListId, {
 *         price_ids: [
 *           price_id
 *         ]
 *       })
 *       .then(({ ids, object, deleted }) => {
 *         console.log(ids.length);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/admin/price-lists/{id}/prices/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "price_ids": [
 *             "adasfa"
 *           ]
 *       }'
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
 *           $ref: "#/components/schemas/AdminPriceListDeleteBatchRes"
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

  const validated = await validator(
    AdminDeletePriceListPricesPricesReq,
    req.body
  )

  const priceListService: PriceListService =
    req.scope.resolve("priceListService")
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  const manager: EntityManager = req.scope.resolve("manager")

  const isMedusaV2FlagEnabled = featureFlagRouter.isFeatureEnabled(
    MedusaV2Flag.key
  )

  if (isMedusaV2FlagEnabled) {
    const deletePriceListPricesWorkflow = removePriceListPrices(req.scope)

    const input = {
      price_list_id: id,
      money_amount_ids: validated.price_ids,
    } as WorkflowTypes.PriceListWorkflow.RemovePriceListPricesWorkflowInputDTO

    await deletePriceListPricesWorkflow.run({
      input,
      context: {
        manager,
      },
    })
  } else {
    await manager.transaction(async (transactionManager) => {
      await priceListService
        .withTransaction(transactionManager)
        .deletePrices(id, validated.price_ids)
    })
  }

  res.json({ ids: validated.price_ids, object: "money-amount", deleted: true })
}

/**
 * @schema AdminDeletePriceListPricesPricesReq
 * type: object
 * properties:
 *   price_ids:
 *     description: The price IDs of the Money Amounts to delete.
 *     type: array
 *     items:
 *       type: string
 */
export class AdminDeletePriceListPricesPricesReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  price_ids: string[]
}
