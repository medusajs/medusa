import { Validator, MedusaError } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /customers/{id}
 * operationId: PostCustomersCustomer
 * summary: Update Customer details
 * description: "Updates a Customer's saved details."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           first_name:
 *             description: "The Customer's first name."
 *             type: string
 *           last_name:
 *             description: "The Customer's last name."
 *             type: string
 *           password:
 *             description: "The Customer's password."
 *             type: string
 *           phone:
 *             description: "The Customer's phone number."
 *             type: string
 *           metadata:
 *             description: "Metadata about the customer."
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
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")
    let customer = await customerService.update(id, value)

    customer = await customerService.retrieve(customer.id, {
      relations: defaultRelations,
      select: defaultFields,
    })

    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}
