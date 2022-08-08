import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import DiscountService from "../../../../services/discount"
import { EntityManager } from "typeorm"

/**
 * @oas [delete] /discounts/{id}/regions/{region_id}
 * operationId: "DeleteDiscountsDiscountRegionsRegion"
 * summary: "Remove Region availability"
 * x-authenticated: true
 * description: "Removes a Region from the list of Regions that a Discount can be used in."
 * parameters:
 *   - (path) id=* {string} The ID of the Discount.
 *   - (path) region_id=* {string} The ID of the Region.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.discounts.removeRegion(discount_id, region_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'localhost:9000/admin/discounts/{id}/regions/{region_id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
 */
export default async (req, res) => {
  const { discount_id, region_id } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await discountService
      .withTransaction(transactionManager)
      .removeRegion(discount_id, region_id)
  })

  const discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}
