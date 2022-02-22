import { IsObject, IsOptional, IsString } from "class-validator"

import { CustomerGroupService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customer-groups
 * operationId: "UpdateCustomerGroupsGroup"
 * summary: "Update a CustomerGroup"
 * description: "Update a CustomerGroup."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
 *   - (body) name=* {string} Name of the customer group
 *   - (body) metadata {object} Metadata for the customer.
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
 *               $ref: "#/components/schemas/customergroup"
 */

export default async (req, res) => {
  const { id } = req.params
  const validated = await validator(AdminPostCustomerGroupsGroupReq, req.body)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customerGroup = await customerGroupService.update(id, validated)

  res.status(200).json({ customerGroup })
}

export class AdminPostCustomerGroupsGroupReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
