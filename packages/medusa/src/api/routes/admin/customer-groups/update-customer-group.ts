import { IsObject, IsOptional, IsString } from "class-validator"
import { defaultAdminCustomerGroupsRelations } from "."

import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"
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

  const validatedBody = await validator(
    AdminPostCustomerGroupsGroupReq,
    req.body
  )
  const validatedParams = await validator(FindParams, req.query)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  await customerGroupService.update(id, validatedBody)

  let expandFields: string[] = []
  if (validatedParams.expand) {
    expandFields = validatedParams.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomerGroupsRelations,
  }

  const customerGroup = await customerGroupService.retrieve(id, findConfig)

  res.json({ customerGroup })
}

export class AdminPostCustomerGroupsGroupReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
