import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { Customer } from "../../../.."
import CustomerController from "../../../../controllers/customers"
import { FindConfig } from "../../../../types/common"
import { AdminListCustomerSelector } from "../../../../types/customers"
import { validator } from "../../../../utils/validator"
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
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const validated = await validator(AdminGetCustomersParams, req.query)

  const customerController: CustomerController = req.scope.resolve(
    "customersController"
  )

  const [customers, count] = await customerController.listAndCount(validated)

  res.json({
    customers,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetCustomersParams extends AdminListCustomerSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
