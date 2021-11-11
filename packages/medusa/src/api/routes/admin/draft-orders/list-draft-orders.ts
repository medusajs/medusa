import { DraftOrder } from "../../../.."
import {
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."
import { DraftOrderService } from "../../../../services"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { validator } from "../../../../utils/validator"
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

  const validated = await validator(AdminGetDraftOrdersReq, req.query)
  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: DraftOrderSelector = {}

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

type DraftOrderSelector = { q?: string }

export class AdminGetDraftOrdersRes {
  draft_orders: DraftOrder[]
  count: number
  offset: number
  limit: number
}

export class AdminGetDraftOrdersReq {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number
}
