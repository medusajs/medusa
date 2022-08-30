import { IsNumber, IsOptional, IsString } from "class-validator"
import {
  defaultAdminDraftOrdersFields,
  defaultAdminDraftOrdersRelations,
} from "."

import { DraftOrder } from "../../../../models"
import { DraftOrderListSelector } from "../../../../types/draft-orders"
import { DraftOrderService } from "../../../../services"
import { FindConfig } from "../../../../types/common"
import { Type } from "class-transformer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /draft-orders
 * operationId: "GetDraftOrders"
 * summary: "List Draft Orders"
 * description: "Retrieves an list of Draft Orders"
 * x-authenticated: true
 * parameters:
 *   - (query) offset=0 {number} The number of items to skip before the results.
 *   - (query) limit=50 {number} Limit the number of items returned.
 *   - (query) q {string} a search term to search emails in carts associated with draft orders and display IDs of draft orders
 * tags:
 *   - Draft Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             draft_orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/draft-order"
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
  const draftOrderService: DraftOrderService =
    req.scope.resolve("draftOrderService")

  const validated = await validator(AdminGetDraftOrdersParams, req.query)

  const selector: DraftOrderListSelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  const listConfig: FindConfig<DraftOrder> = {
    select: defaultAdminDraftOrdersFields,
    relations: defaultAdminDraftOrdersRelations,
    skip: validated.offset ?? 0,
    take: validated.limit ?? 50,
    order: { created_at: "DESC" },
  }

  const [draftOrders, count] = await draftOrderService.listAndCount(
    selector,
    listConfig
  )

  res.json({
    draft_orders: draftOrders,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetDraftOrdersParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0
}
