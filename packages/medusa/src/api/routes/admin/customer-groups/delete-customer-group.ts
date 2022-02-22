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
 *             customerGroup:
 *               $ref: "#/components/schemas/customergroup"
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
