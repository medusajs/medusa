import { DraftOrder } from "../../../.."
import {
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."
import { DraftOrderService } from "../../../../services"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
import { Type } from "class-transformer"
import { DraftOrderListSelector } from "../../../../types/draft-orders"
/**
 * @oas [get] /draft-orders
 * operationId: "GetDraftOrders"
 * summary: "List Draft Orders"
 * description: "Retrieves an list of Draft Orders"
 * x-authenticated: true
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_order:
 *               $ref: "#/components/schemas/draft-order"
 */

export default async (req, res) => {
  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")

  const validated = await validator(AdminGetDraftOrdersParams, req.query)
  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: DraftOrderListSelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  const listConfig = {
    select: defaultAdminDraftOrdersFields,
    relations: defaultAdminDraftOrdersRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [draftOrders, count] = await draftOrderService.listAndCount(
    selector,
    listConfig
  )

  res.json({ draft_orders: draftOrders, count, offset, limit })
}

export class AdminGetDraftOrdersParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number
}
