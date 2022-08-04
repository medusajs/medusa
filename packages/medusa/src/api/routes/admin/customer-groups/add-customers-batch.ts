import { Request, Response } from "express"

import { CustomerGroupService } from "../../../../services"
import { CustomerGroupsBatchCustomer } from "../../../../types/customer-groups"
import { EntityManager } from "typeorm"
import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customer-groups/{id}/customers/batch
 * operationId: "PostCustomerGroupsGroupCustomersBatch"
 * summary: "Add a list of customers to a customer group "
 * description: "Adds a list of customers, represented by id's, to a customer group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the customer group.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - customer_ids
 *         properties:
 *           customer_ids:
 *             description: "The ids of the customers to add"
 *             type: array
 *             items:
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   description: ID of the customer
 *                   type: string
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
  const { id } = req.params
  const validated = await validator(
    AdminPostCustomerGroupsGroupCustomersBatchReq,
    req.body
  )

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const customer_group = await manager.transaction(
    async (transactionManager) => {
      return await customerGroupService
        .withTransaction(transactionManager)
        .addCustomers(
          id,
          validated.customer_ids.map(({ id }) => id)
        )
    }
  )

  res.status(200).json({ customer_group })
}

export class AdminPostCustomerGroupsGroupCustomersBatchReq {
  @ValidateNested({ each: true })
  @Type(() => CustomerGroupsBatchCustomer)
  customer_ids: CustomerGroupsBatchCustomer[]
}
