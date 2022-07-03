import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { CustomerGroupsBatchCustomer } from "../../../../types/customer-groups"
import { validator } from "../../../../utils/validator"
import { Request, Response } from "express"

/**
 * @oas [post] /customer-groups/{id}/customers/batch
 * operationId: "PostCustomerGroupsGroupCustomersBatch"
 * summary: "Add a list of customers to a customer group "
 * description: "Adds a list of customers, represented by id's, to a customer group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
 *   - (body) customers=* {{id: string }[]} ids of the customers to add
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

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const validated = await validator(
    AdminPostCustomerGroupsGroupCustomersBatchReq,
    req.body
  )

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customer_group = await customerGroupService.addCustomers(
    id,
    validated.customer_ids.map(({ id }) => id)
  )
  res.status(200).json({ customer_group })
}

export class AdminPostCustomerGroupsGroupCustomersBatchReq {
  @ValidateNested({ each: true })
  @Type(() => CustomerGroupsBatchCustomer)
  customer_ids: CustomerGroupsBatchCustomer[]
}
