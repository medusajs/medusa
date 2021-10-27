import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /orders/{id}/shipping-methods
 * operationId: "PostOrdersOrderShippingMethods"
 * summary: "Add a Shipping Method"
 * description: "Adds a Shipping Method to an Order. If another Shipping Method exists with the same Shipping Profile, the previous Shipping Method will be replaced."
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 *   - (body) price=* {integer} The price (excluding VAT) that should be charged for the Shipping Method
 *   - (body) option_id=* {string} The id of the Shipping Option to create the Shipping Method from.
 *   - (body) data=* {object} The data required for the Shipping Option to create a Shipping Method. This will depend on the Fulfillment Provider.
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    price: Validator.number().integer().integer().allow(0).required(),
    option_id: Validator.string().required(),
    data: Validator.object().optional().default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const orderService = req.scope.resolve("orderService")

  await orderService.addShippingMethod(id, value.option_id, value.data, {
    price: value.price,
  })

  const order = await orderService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ order })
}
