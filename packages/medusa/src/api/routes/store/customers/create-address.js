import { Validator, MedusaError } from "medusa-core-utils"

/**
 * @oas [post] /customers/{id}/addresses
 * operationId: PostCustomersCustomerAddresses
 * summary: "Add a Shipping Address"
 * description: "Adds a Shipping Address to a Customer's saved addresses."
 * parameters:
 *   - (path) id=* {String} The Customer id.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           address:
 *             description: "The Address to add to the Customer."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    address: Validator.address().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const customerService = req.scope.resolve("customerService")

    let customer = await customerService.addAddress(id, value.address)
    customer = await customerService.retrieve(id, {
      relations: ["shipping_addresses"],
    })

    res.status(200).json({ customer })
  } catch (err) {
    throw err
  }
}
