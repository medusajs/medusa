import { Type } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"

import { SwapService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { FindConfig } from "../../../../types/common"
import { Swap } from "../../../../models"

/**
 * @oas [get] /swaps
 * operationId: "GetSwaps"
 * summary: "List Swaps"
 * description: "Retrieves a list of Swaps."
 * parameters:
 *   - (query) limit=50 {number} The upper limit for the amount of responses returned.
 *   - (query) offset=0 {number} The offset of the list returned.
 * x-authenticated: true
 * tags:
 *   - Swap
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             swaps:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/swap"
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
