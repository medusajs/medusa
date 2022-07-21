import { IsNumber, IsOptional, IsString } from "class-validator"

import { AdminListCustomerSelector } from "../../../../types/customers"
import { Type } from "class-transformer"
import customerController from "../../../../controllers/customers"

/**
 * @oas [get] /customers
 * operationId: "GetCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of Customers."
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
 *             customers:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const result = await customerController.listAndCount(
    req.scope,
    req.query,
    req.body
  )

  res.json(result)
}

export class AdminGetCustomersParams extends AdminListCustomerSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
