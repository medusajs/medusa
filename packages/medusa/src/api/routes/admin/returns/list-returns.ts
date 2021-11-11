import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"
import { Return } from "../../../.."
import { PaginatedResponse } from "../../../../types/common"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /returns
 * operationId: "GetReturns"
 * summary: "List Returns"
 * description: "Retrieves a list of Returns"
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
 */
export default async (req, res) => {
  const returnService = req.scope.resolve("returnService")

  const validated = await validator(AdminGetReturnsReq, req.query)

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector = {}

  const listConfig = {
    relations: ["swap", "order"],
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const returns = await returnService.list(selector, { ...listConfig })

  res.json({ returns, count: returns.length, offset, limit })
}

export type AdminGetReturnsResponse = PaginatedResponse & {
  returns: Return[]
}

export class AdminGetReturnsReq {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
}
