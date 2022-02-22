import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { defaultAdminCustomerGroupsRelations } from "."

/**
 * @oas [get] /customer-group
 * operationId: "ListCustomerGroupsGroup"
 * summary: "Retrieve a list of customer groups"
 * description: "Retrieve a list of customer groups."
 * x-authenticated: true
 * parameters:
 *   - (query) q {string} Query used for searching user group names.
 *   - (query) offset {string} How many orders to skip in the result.
 *   - (query) limit {string} Limit the number of orders returned.
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
 *               $ref: "#/components/schemas/customer-group"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminGetCustomerGroupsGroupParams,
    req.query
  )

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomerGroupsRelations,
  }

  const customerGroup = await customerGroupService.list(id, findConfig)

  res.json({ customerGroup })
}

export class AdminGetCustomerGroupsGroupParams extends AdminListOrdersSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsString()
  @IsOptional()
  expand?: string

  @IsString()
  @IsOptional()
  fields?: string
}
