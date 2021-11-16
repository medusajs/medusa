import { IsNumber, IsOptional, IsString } from "class-validator"
import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import { FindConfig } from "../../../../types/common"
import { QuerySelector } from "../../../../types/discount"
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

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: QuerySelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const listConfig: FindConfig<Customer> = {
    relations: expandFields,
    skip: offset,
    take: limit,
  }

  const [customers, count] = await customerService.listAndCount(
    selector,
    listConfig
  )

  res.json({ customers, count, offset, limit })
}

export class AdminGetCustomersParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number

  @IsString()
  @IsOptional()
  expand?: string
}
