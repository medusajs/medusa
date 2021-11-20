import { Type } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"
import { SwapService } from "../../../../services"
import { validator } from "../../../../utils/validator"
/**
 * @oas [get] /swaps
 * operationId: "GetSwaps"
 * summary: "List Swaps"
 * description: "Retrieves a list of Swaps."
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
 */
export default async (req, res) => {
  const swapService: SwapService = req.scope.resolve("swapService")

  const { offset, limit } = await validator(AdminGetSwapsParams, req.query)

  const selector = {}

  const listConfig = {
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
