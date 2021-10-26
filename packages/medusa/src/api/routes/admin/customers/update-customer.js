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
 *           email:
 *             type: string
 *             description: The Customer's email. Only providable if user not registered.
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
    email: Validator.string().optional(),
    first_name: Validator.string().optional(),
    last_name: Validator.string().optional(),
    password: Validator.string().optional(),
    phone: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const customerService = req.scope.resolve("customerService")

  let customer = await customerService.retrieve(id)

  if (value.email && customer.has_account) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email cannot be changed when the user has registered their account"
    )
  }

  await customerService.update(id, value)

  customer = await customerService.retrieve(id, {
    relations: ["orders"],
  })
  res.status(200).json({ customer })
}
