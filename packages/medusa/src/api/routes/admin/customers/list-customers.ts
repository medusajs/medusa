import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import customerController from "../../../../controllers/customers"
import { CustomerService } from "../../../../services"
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

  const customerService: CustomerService = req.scope.resolve("customerService")

  const [customers, count] = await customerController.listAndCount(
    customerService,
    validated
  )

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
