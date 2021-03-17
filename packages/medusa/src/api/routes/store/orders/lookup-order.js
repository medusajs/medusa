import { Validator, MedusaError } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./index"

/**
 * @oas [get] /orders
 * operationId: "GetOrders"
 * summary: "Look Up an Order"
 * description: "Looks for an Order with a given `display_id`, `email` pair. The `display_id`, `email` pair must match in order for the Order to be returned."
 * parameters:
 *   - (query) display_id=* {number} The display id given to the Order.
 *   - (query) email=* {string} The email of the Order with the given display_id.
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
  const schema = Validator.object().keys({
    display_id: Validator.number().required(),
    email: Validator.string().required(),
    shipping_address: Validator.object()
      .keys({
        postal_code: Validator.string(),
      })
      .optional(),
  })

  const { value, error } = schema.validate(req.query)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    const orders = await orderService.list(
      {
        display_id: value.display_id,
        email: value.email,
      },
      {
        select: defaultFields,
        relations: defaultRelations,
      }
    )

    if (orders.length !== 1) {
      res.sendStatus(404)
      return
    }

    const order = orders[0]

    res.json({ order })
  } catch (error) {
    console.log(error)
    throw error
  }
}
