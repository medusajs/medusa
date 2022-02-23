import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"
import omit from "lodash/omit"

import { validator } from "../../../../utils/validator"
import { CustomerGroupService } from "../../../../services"
import { CustomerGroup } from "../../../../models/customer-group"
import { FindConfig } from "../../../../types/common"
import { defaultAdminCustomerGroupsRelations } from "."

/**
 * @oas [get] /customer-groups
 * operationId: "GetCustomerGroups"
 * summary: "Retrieve a list of customer groups"
 * description: "Retrieve a list of customer groups."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching user group names.
 *   - (query) offset {string} How many groups to skip in the result.
 *   - (query) limit {string} Limit the number of groups returned.
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
export default async (req, res) => {
  const validated = await validator(AdminGetCustomerGroupsListParams, req.query)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const listConfig: FindConfig<CustomerGroup> = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomerGroupsRelations,
    skip: validated.offset,
    take: validated.limit,
    order: { created_at: "DESC" },
  }

  const filterableFields = omit(validated, ["limit", "offset", "expand"])

  const [data, count] = await customerGroupService.listAndCount(
    filterableFields,
    listConfig
  )

  res.json({
    count,
    customerGroups: data,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetCustomerGroupsListParams {
  @IsString()
  @IsOptional()
  q?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsString()
  @IsOptional()
  expand?: string
}
