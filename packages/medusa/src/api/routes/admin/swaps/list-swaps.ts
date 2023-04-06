import { Type } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"

import { SwapService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { FindConfig } from "../../../../types/common"
import { Swap } from "../../../../models"

/**
 * @oas [get] /admin/swaps
 * operationId: "GetSwaps"
 * summary: "List Swaps"
 * description: "Retrieves a list of Swaps."
 * parameters:
 *   - (query) limit=50 {number} The upper limit for the amount of responses returned.
 *   - (query) offset=0 {number} The offset of the list returned.
 * x-authenticated: true
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetSwapsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.swaps.list()
 *       .then(({ swaps }) => {
 *         console.log(swaps.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/swaps' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Swaps
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSwapsListRes"
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
  const swapService: SwapService = req.scope.resolve("swapService")

  const { offset, limit } = await validator(AdminGetSwapsParams, req.query)

  const selector = {}

  const listConfig: FindConfig<Swap> = {
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const swaps = await swapService.list(selector, { ...listConfig })

  res.json({ swaps, count: swaps.length, offset, limit })
}

export class AdminGetSwapsParams {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
