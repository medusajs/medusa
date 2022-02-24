import { CustomerGroupService } from "../../../../services"

/**
 * @oas [delete] /customer-groups/{id}
 * operationId: "DeleteCustomerGroupsCustomerGroup"
 * summary: "Delete a CustomerGroup"
 * description: "Deletes a CustomerGroup."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Customer Group
 * tags:
 *   - CustomerGroup
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The id of the deleted customer group.
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *             deleted:
 *               type: boolean
 */

export default async (req, res) => {
  const { id } = req.params

  const customerGroupService: CustomerGroupService = req.scope.resolve(
    "customerGroupService"
  )

  await customerGroupService.delete(id)

  res.json({
    id: id,
    object: "customer_group",
    deleted: true,
  })
}
