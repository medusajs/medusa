import { IsObject, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { EntityManager } from "typeorm"
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
 *   - Customer Group
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
  const validated = await validator(AdminPostCustomerGroupsReq, req.body)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const customerGroup = await manager.transaction(
    async (transactionManager) => {
      return await customerGroupService
        .withTransaction(transactionManager)
        .create(validated)
    }
  )

  res.status(200).json({ customer_group: customerGroup })
}

export class AdminPostCustomerGroupsReq {
  @IsString()
  name: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
