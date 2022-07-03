import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { FilterableCustomerGroupProps } from "../../../../types/customer-groups"
import { Request, Response } from "express"

/**
 * @oas [get] /customer-groups
 * operationId: "GetCustomerGroups"
 * summary: "Retrieve a list of customer groups"
 * description: "Retrieve a list of customer groups."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching user group names.
 *   - (query) offset {string} How many groups to skip in the result.
 *   - (query) id {string} Ids of the groups to search for.
 *   - (query) order {string} to retrieve customer groups in.
 *   - (query) created_at {DateComparisonOperator} Date comparison for when resulting customer group was created, i.e. less than, greater than etc.
 *   - (query) updated_at {DateComparisonOperator} Date comparison for when resulting ustomer group was updated, i.e. less than, greater than etc.
 *   - (query) offset {string} How many customer groups to skip in the result.
 *   - (query) limit {string} Limit the number of customer groups returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each customer groups of the result.

 * tags:
 *   - CustomerGroup
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customerGroup:
 *               $ref: "#/components/schemas/customer_group"
 */
export default async (req: Request, res: Response) => {
  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const [data, count] = await customerGroupService.listAndCount(
    req.filterableFields,
    req.listConfig
  )

  const { limit, offset } = req.validatedQuery
  res.json({
    count,
    customer_groups: data,
    offset,
    limit,
  })
}

export class AdminGetCustomerGroupsParams extends FilterableCustomerGroupProps {
  @IsString()
  @IsOptional()
  order?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsString()
  @IsOptional()
  expand?: string
}
