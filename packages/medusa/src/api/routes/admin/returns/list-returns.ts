import { IsNumber, IsOptional } from "class-validator"

import { FindConfig } from "../../../../types/common"
import { Return } from "../../../../models"
import { ReturnService } from "../../../../services"
import { Type } from "class-transformer"
import { defaultRelationsList } from "."
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /admin/returns
 * operationId: "GetReturns"
 * summary: "List Returns"
 * description: "Retrieve a list of Returns. The returns can be paginated."
 * parameters:
 *   - (query) limit=50 {number} Limit the number of Returns returned.
 *   - (query) offset=0 {number} The number of Returns to skip when retrieving the Returns.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetReturnsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.returns.list()
 *       .then(({ returns, limit, offset, count }) => {
 *         console.log(returns.length)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/returns' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Returns
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReturnsListRes"
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
  const returnService: ReturnService = req.scope.resolve("returnService")

  const validated = await validator(AdminGetReturnsParams, req.query)

  const selector = {}

  const listConfig = {
    relations: defaultRelationsList,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  } as FindConfig<Return>

  const [returns, count] = await returnService.listAndCount(selector, {
    ...listConfig,
  })

  res.json({
    returns,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

/**
 * {@inheritDoc FindPaginationParams}
 */
export class AdminGetReturnsParams {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 50
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number = 0
}
