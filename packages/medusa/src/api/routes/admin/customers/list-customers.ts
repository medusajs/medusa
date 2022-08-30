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
 * parameters:
 *   - (query) limit=50 {integer} The number of items to return.
 *   - (query) offset=0 {integer} The items to skip before result.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each customer.
 *   - (query) q {string} a search term to search email, first_name, and last_name.
 *   - (query) groups[] {string} group IDs to search customers by.
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
