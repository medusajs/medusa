import { IsNumber, IsOptional } from "class-validator"

import { ReturnService } from "../../../../services"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"
import { FindConfig } from "../../../../types/common"
import { Return } from "../../../../models"

/**
 * @oas [get] /returns
 * operationId: "GetReturns"
 * summary: "List Returns"
 * description: "Retrieves a list of Returns"
 * parameters:
 *   - (query) limit=50 {number} The upper limit for the amount of responses returned.
 *   - (query) offset=0 {number} The offset of the list returned.
 * tags:
 *   - Return
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             returns:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/return"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const returnService: ReturnService = req.scope.resolve("returnService")

  const validated = await validator(AdminGetReturnsParams, req.query)

  const selector = {}

  const listConfig = {
    relations: ["swap", "order"],
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
