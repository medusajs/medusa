import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "../../../../models/order"
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request, Response } from "express"

import { DateComparisonOperator } from "../../../../types/common"
import { MedusaError } from "medusa-core-utils"
import OrderService from "../../../../services/order"
import { Type } from "class-transformer"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching orders.
 *   - (query) id {string} Id of the order to search for.
 *   - in: query
 *     name: status
 *     style: form
 *     explode: false
 *     description: Status to search for.
 *     schema:
 *         type: array
 *         items:
 *           type: string
 *   - in: query
 *     name: fulfillment_status
 *     style: form
 *     explode: false
 *     description: Fulfillment status to search for.
 *     schema:
 *         type: array
 *         items:
 *           type: string
 *   - in: query
 *     name: payment_status
 *     style: form
 *     explode: false
 *     description: Payment status to search for.
 *     schema:
 *         type: array
 *         items:
 *           type: string
 *   - (query) display_id {string} Display id to search for.
 *   - (query) cart_id {string} to search for.
 *   - (query) email {string} to search for.
 *   - (query) region_id {string} to search for.
 *   - (query) currency_code {string} to search for.
 *   - (query) tax_rate {string} to search for.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting collections were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting collections were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: canceled_at
 *     description: Date comparison for when resulting collections were canceled.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) limit=10 {integer} How many orders to return.
 *   - (query) offset=0 {integer} The offset in the resulting orders.
 *   - (query) fields {string} (Comma separated string) Which fields should be included in the resulting orders.
 *   - (query) expand {string} (Comma separated string) Which relations should be expanded in the resulting orders.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/order"
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
export default async (req: Request, res: Response) => {
  const id: string | undefined = req.user?.customer_id

  if (!id) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Not authorized to list orders"
    )
  }

  const orderService: OrderService = req.scope.resolve("orderService")

  req.filterableFields = {
    ...req.filterableFields,
    customer_id: id,
  }

  const [orders, count] = await orderService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery

  res.json({ orders, count, offset: offset, limit: limit })
}

export class StoreGetCustomersCustomerOrdersPaginationParams {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit = 10

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset = 0

  @IsOptional()
  @IsString()
  fields?: string

  @IsOptional()
  @IsString()
  expand?: string
}

export class StoreGetCustomersCustomerOrdersParams extends StoreGetCustomersCustomerOrdersPaginationParams {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[]

  @IsOptional()
  @IsEnum(FulfillmentStatus, { each: true })
  fulfillment_status?: FulfillmentStatus[]

  @IsOptional()
  @IsEnum(PaymentStatus, { each: true })
  payment_status?: PaymentStatus[]

  @IsString()
  @IsOptional()
  display_id?: string

  @IsString()
  @IsOptional()
  cart_id?: string

  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  region_id?: string

  @IsString()
  @IsOptional()
  currency_code?: string

  @IsString()
  @IsOptional()
  tax_rate?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  canceled_at?: DateComparisonOperator
}
