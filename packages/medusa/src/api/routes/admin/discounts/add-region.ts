import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "."

import { Discount } from "../../../.."
import DiscountService from "../../../../services/discount"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /discounts/{id}/regions/{region_id}
 * operationId: "PostDiscountsDiscountRegionsRegion"
 * summary: "Adds Region availability"
 * description: "Adds a Region to the list of Regions that a Discount can be used in."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount.
 *   - (path) region_id=* {string} The ID of the Region.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.addRegion(discount_id, region_id)
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/discounts/{id}/regions/{region_id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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
      .addRegion(discount_id, region_id)
  })

  const discount: Discount = await discountService.retrieve(discount_id, {
    select: defaultAdminDiscountsFields,
    relations: defaultAdminDiscountsRelations,
  })

  res.status(200).json({ discount })
}
