import { Request, Response } from "express"
import DiscountService from "../../../../services/discount"
import { FindParams } from "../../../../types/common"

/**
 * @oas [get] /admin/discounts/code/{code}
 * operationId: "GetDiscountsDiscountCode"
 * summary: "Get Discount by Code"
 * description: "Retrieve a Discount's details by its discount code"
 * x-authenticated: true
 * parameters:
 *   - (path) code=* {string} The code of the Discount
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned discount.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned discount.
 * x-codegen:
 *   method: retrieveByCode
 *   queryParams: AdminGetDiscountsDiscountCodeParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.retrieveByCode(code)
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/discounts/code/{code}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Discounts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminDiscountsRes"
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
export default async (req: Request, res: Response) => {
  const { code } = req.params

  const discountService: DiscountService = req.scope.resolve("discountService")
  const discount = await discountService.retrieveByCode(
    code,
    req.retrieveConfig
  )

  res.status(200).json({ discount })
}

export class AdminGetDiscountsDiscountCodeParams extends FindParams {}
