import { IsInt, IsOptional } from "class-validator"

import { FindConfig } from "../../../../types/common"
import { Swap } from "../../../../models"
import { SwapService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/swaps
 * operationId: "GetSwaps"
 * summary: "List Swaps"
 * description: "Retrieve a list of Swaps. The swaps can be paginated."
 * parameters:
 *   - (query) limit=50 {number} Limit the number of swaps returned.
 *   - (query) offset=0 {number} The number of swaps to skip when retrieving the swaps.
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
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/swaps' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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

  const [swaps, count] = await swapService.listAndCount(selector, {
    ...listConfig,
  })

  res.json({ swaps, count, offset, limit })
}

/**
 * {@inheritDoc FindPaginationParams}
 */
export class AdminGetSwapsParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   */
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   */
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
