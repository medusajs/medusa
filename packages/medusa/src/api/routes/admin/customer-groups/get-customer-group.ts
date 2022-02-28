import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { defaultAdminCustomerGroupsRelations } from "."

/**
 * @oas [get] /customer-group/{id}
 * operationId: "GetCustomerGroupsGroup"
 * summary: "Retrieve a CustomerGroup"
 * description: "Retrieves a Customer Group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Customer Group.
 * tags:
 *   - CustomerGroup
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer_group:
 *               $ref: "#/components/schemas/customer_group"
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

  const customerGroup = await customerGroupService.retrieve(id, findConfig)

  res.json({ customer_group: customerGroup })
}

export class AdminGetCustomerGroupsGroupParams extends FindParams {}
