import { Validator, MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * parameters:
 *   - (body) email=* {string} The Customer's email address.
 *   - (body) first_name=* {string} The Customer's first name.
 *   - (body) last_name=* {string} The Customer's last name.
 *   - (body) phone {string} The Customer's phone number.
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
  const schema = Validator.object().keys({
    email: Validator.string()
      .email()
      .required(),
    first_name: Validator.string().required(),
    last_name: Validator.string().required(),
    password: Validator.string().required(),
    phone: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.create(value)
    res.status(201).json({ customer })
  } catch (err) {
    throw err
  }
}
