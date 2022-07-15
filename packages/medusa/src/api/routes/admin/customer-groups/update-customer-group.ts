import { IsObject, IsOptional, IsString } from "class-validator"
import { defaultAdminCustomerGroupsRelations } from "."

import { CustomerGroupService } from "../../../../services"
import { FindParams } from "../../../../types/common"
import { validator } from "../../../../utils/validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customer-groups/{id}
 * operationId: "PostCustomerGroupsGroup"
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
 *             customer_group:
 *               $ref: "#/components/schemas/customer_group"
 */

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const validatedBody = await validator(
    AdminPostCustomerGroupsGroupReq,
    req.body
  )
  const validatedQuery = await validator(FindParams, req.query)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerGroupService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  let expandFields: string[] = []
  if (validatedQuery.expand) {
    expandFields = validatedQuery.expand.split(",")
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultAdminCustomerGroupsRelations,
  }

  const customerGroup = await customerGroupService.retrieve(id, findConfig)

  res.json({ customer_group: customerGroup })
}

export class AdminPostCustomerGroupsGroupReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
