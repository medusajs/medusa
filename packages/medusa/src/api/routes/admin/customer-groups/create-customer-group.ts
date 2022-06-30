import { IsObject, IsOptional, IsString } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customer-groups
 * operationId: "PostCustomerGroups"
 * summary: "Create a CustomerGroup"
 * description: "Creates a CustomerGroup."
 * x-authenticated: true
 * parameters:
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
 *             customer_group:
 *               $ref: "#/components/schemas/customer_group"
 */

export default async (req, res) => {
  const validated = await validator(AdminPostCustomerGroupsReq, req.body)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customerGroup = await customerGroupService.create(validated)
  res.status(200).json({ customer_group: customerGroup })
}

export class AdminPostCustomerGroupsReq {
  @IsString()
  name: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
