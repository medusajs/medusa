import { Request, Response } from "express"
import { Type } from "class-transformer"
import { MedusaError } from "medusa-core-utils"
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from "../../../../models/order"
import OrderService from "../../../../services/order"
import { DateComparisonOperator } from "../../../../types/common"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching orders.
 *   - (query) id {string} Id of the order to search for.
 *   - (query) status {string[]} Status to search for.
 *   - (query) fulfillment_status {string[]} Fulfillment status to search for.
 *   - (query) payment_status {string[]} Payment status to search for.
 *   - (query) display_id {string} Display id to search for.
 *   - (query) cart_id {string} to search for.
 *   - (query) email {string} to search for.
 *   - (query) region_id {string} to search for.
 *   - (query) currency_code {string} to search for.
 *   - (query) tax_rate {string} to search for.
 *   - (query) cancelled_at {DateComparisonOperator} Date comparison for when resulting orders was cancelled, i.e. less than, greater than etc.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting orders was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting orders was updated, i.e. less than, greater than etc.
 *   - (query) limit {integer} How many addresses to return.
 *   - (query) offset {integer} The offset in the resulting addresses.
 *   - (query) fields {string} (Comma separated string) Which fields should be included in the resulting addresses.
 *   - (query) expand {string} (Comma separated string) Which relations should be expanded in the resulting addresses.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Orders.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Orders to return,
 *               type: integer
 *             orders:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/orders"
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
