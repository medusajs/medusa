import { Validator, MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /customers/{id}
 * operationId: "PostCustomersCustomer"
 * summary: "Update a Customer"
 * description: "Updates a Customer."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           first_name:
 *             type: string
 *             description:  The Customer's first name.
 *           last_name:
 *             type: string
 *             description:  The Customer's last name.
 *           phone:
 *             description: The Customer's phone number.
 *             type: object
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
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    first_name: Validator.string().optional(),
    last_name: Validator.string().optional(),
    password: Validator.string().optional(),
    phone: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")
    await customerService.update(id, value)

    const customer = await customerService.retrieve(id, {
      relations: ["orders"],
    })
    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}
