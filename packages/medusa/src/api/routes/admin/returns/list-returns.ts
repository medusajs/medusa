import { IsNumber, IsOptional } from "class-validator"

import { ReturnService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { FindConfig } from "../../../../types/common"
import { Return } from "../../../../models"
import { defaultRelationsList } from "."

/**
 * @oas [get] /admin/returns
 * operationId: "GetReturns"
 * summary: "List Returns"
 * description: "Retrieves a list of Returns"
 * parameters:
 *   - (query) limit=50 {number} The upper limit for the amount of responses returned.
 *   - (query) offset=0 {number} The offset of the list returned.
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
 *         console.log(returns.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/returns' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
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

  const returns = await returnService.list(selector, { ...listConfig })

  res.json({
    returns,
    count: returns.length,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetReturnsParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 50

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number = 0
}
