import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { defaultAdminCustomerGroupsRelations } from "."

/**
 * @oas [get] /customer-group/{id}
 * operationId: "GetCustomerGroups"
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
 *             customerGroup:
 *               $ref: "#/components/schemas/customer-group"
 */
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(FindParams, req.query)

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

  res.json({ customerGroup })
}
