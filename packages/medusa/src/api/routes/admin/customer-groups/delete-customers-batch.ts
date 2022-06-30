import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { CustomerGroupsBatchCustomer } from "../../../../types/customer-groups"
import { validator } from "../../../../utils/validator"

/**
 * @oas [delete] /customer-groups/{id}/customers/batch
 * operationId: "DeleteCustomerGroupsGroupCustomerBatch"
 * summary: "Remove a list of customers from a customer group "
 * description: "Removes a list of customers, represented by id's, from a customer group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
 *   - (body) customers=* {{id: string }[]} ids of the customers to remove
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
  const validated = await validator(
    AdminDeleteCustomerGroupsGroupCustomerBatchReq,
    req.body
  )

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customer_group = await customerGroupService.removeCustomer(
    id,
    validated.customer_ids.map(({ id }) => id)
  )
  res.status(200).json({ customer_group })
}

export class AdminDeleteCustomerGroupsGroupCustomerBatchReq {
  @ValidateNested({ each: true })
  @Type(() => CustomerGroupsBatchCustomer)
  customer_ids: CustomerGroupsBatchCustomer[]
}
