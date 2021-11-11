<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/list-orders.ts
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Order } from "../../../.."
import OrderService from "../../../../services/order"
import { PaginatedResponse } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
=======
import { Order } from "../../../.."
import OrderService from "../../../../services/order"
import { PaginatedResponse } from "../../../../types/common"
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/list-orders.js
import {
  allowedFields,
  allowedRelations,
  defaultFields,
  defaultRelations,
} from "../orders"

/**
 * @oas [get] /customers/me/orders
 * operationId: GetCustomersCustomerOrders
 * summary: Retrieve Customer Orders
 * description: "Retrieves a list of a Customer's Orders."
 * x-authenticated: true
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
export default async (req, res) => {
  const id: string = req.user.customer_id

<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/list-orders.ts
  const orderService: OrderService = req.scope.resolve("orderService")
=======
  const orderService = req.scope.resolve("orderService") as OrderService
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/list-orders.js

  const selector = {
    customer_id: id,
  }

  const validated = await validator(
    StoreGetCustomersCustomerOrdersQuery,
    req.query
  )

  const limit = validated.limit || 10
  const offset = validated.offset || 0

  let includeFields: string[] = []
  if (validated.fields) {
    includeFields = validated.fields.split(",")
    includeFields = includeFields.filter((f) => allowedFields.includes(f))
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
    expandFields = expandFields.filter((f) => allowedRelations.includes(f))
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  }

  const [orders, count] = await orderService.listAndCount(selector, listConfig)

  res.json({ orders, count, offset, limit })
}

<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/list-orders.ts
export type StoreGetCustomersCustomerOrdersResponse = PaginatedResponse & {
  orders: Order[]
}

export class StoreGetCustomersCustomerOrdersQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number
  @IsOptional()
  @IsString()
  fields?: string
  @IsOptional()
  @IsString()
  expand?: string
}
=======
export type ListCustomerOrdersReponse = PaginatedResponse & {
  orders: Order[]
}
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/list-orders.js
