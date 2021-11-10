import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import { FindConfig } from "../../../../types/common"
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
  const validated = await validator(AdminListCustomersRequest, req.query)

  const customerService: CustomerService = req.scope.resolve("customerService")

  const limit = validated.limit || 50
  const offset = validated.offset || 0

  const selector: QuerySelector = {}

  if (validated.q) {
    selector.q = validated.q
  }

  // let expandFields = []
  // if (validated.expand) {
  //   expandFields = req.query.expand.split(",")
  // }

  const listConfig: FindConfig<Customer> = {
    relations: validated.expand || [],
    skip: offset,
    take: limit,
  }

  const [customers, count] = await customerService.listAndCount(
    selector,
    listConfig
  )

  res.json({ customers, count, offset, limit })
}

type QuerySelector = {
  q?: string
}

export class AdminListCustomersRequest {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  limit?: number

  @IsNumber()
  @IsOptional()
  offset?: number

  @IsArray({})
  @IsString({ each: true })
  @IsOptional()
  expand?: string[]
}
