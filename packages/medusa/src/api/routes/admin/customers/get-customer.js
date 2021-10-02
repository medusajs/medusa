import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /customers/{id}
 * operationId: "GetCustomersCustomer"
 * summary: "Retrieve a Customer"
 * description: "Retrieves a Customer."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 orders:
 *                   description: "The Customer's orders."
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/order"
 *                 billing_address_id:
 *                   type: string
 *                   nullable: true
 *                 billing_address:
 *                   nullable: true
 *                   description: "The Customer's billing address."
 *                   anyOf:
 *                     - $ref: "#/components/schemas/address"
 *                     - type: string
 *                 shipping_addresses:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/address"
 *                 first_name:
 *                   type: string
 *                   nullable: true
 *                 last_name:
 *                   type: string
 *                   nullable: true
 *                 phone:
 *                   type: string
 *                   nullable: true
 *                 has_account:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 deleted_at:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 metadata:
 *                   type: object
 *                   nullable: true
 */
export default async (req, res) => {
  const { id } = req.params
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(id, {
      relations: defaultRelations,
      select: defaultFields,
    })

    res.json({ customer })
  } catch (err) {
    throw err
  }
}
