import jwt from "jsonwebtoken"
import { Validator, MedusaError } from "medusa-core-utils"
import config from "../../../../config"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /customers
 * operationId: PostCustomers
 * summary: Create a Customer
 * description: "Creates a Customer account."
 * parameters:
 *   - (body) email=* {string} The Customer's email address.
 *   - (body) first_name=* {string} The Customer's first name.
 *   - (body) last_name=* {string} The Customer's last name.
 *   - (body) password=* {string} The Customer's password for login.
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
    email: Validator.string().email().required(),
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
    let customer = await customerService.create(value)

    // Add JWT to cookie
    req.session.jwt = jwt.sign({ customer_id: customer.id }, config.jwtSecret, {
      expiresIn: "30d",
    })

    customer = await customerService.retrieve(customer.id, {
      relations: defaultRelations,
      select: defaultFields,
    })

    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}
