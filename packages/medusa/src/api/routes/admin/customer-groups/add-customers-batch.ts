import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { CustomerGroupService } from "../../../../services"
import { CustomerGroupsBatchCustomer } from "../../../../types/customer-groups"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customer-groups/{id}/batch
 * operationId: "PostCustomerGroupsBatch"
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

export default async (req, res) => {
  const { id } = req.params
  const validated = await validator(AdminPostCustomerGroupsBatchReq, req.body)

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  const customer_group = await customerGroupService.addCustomerBatch(
    id,
    validated.customerIds
  )
  res.status(200).json({ customer_group })
}

export class AdminPostCustomerGroupsBatchReq {
  @ValidateNested({ each: true })
  @Type(() => CustomerGroupsBatchCustomer)
  customerIds: CustomerGroupsBatchCustomer[]
}
