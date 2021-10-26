import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /carts/{id}/shipping-methods
 * operationId: "PostCartsCartShippingMethod"
 * description: "Adds a Shipping Method to the Cart."
 * summary: "Add a Shipping Method"
 * tags:
 *   - Cart
 * parameters:
 *   - (path) id=* {String} The cart id.
 *   - (body) option_id=* {String} id of the shipping option to create the method from
 *   - (body) data {Object} Used to hold any data that the shipping method may need to process the fulfillment of the order. Look at the documentation for your installed fulfillment providers to find out what to send.
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            cart:
 *              $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    option_id: Validator.string().required(),
    data: Validator.object().optional().default({}),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const manager = req.scope.resolve("manager")
    const cartService = req.scope.resolve("cartService")

    await manager.transaction(async (m) => {
      const txCartService = cartService.withTransaction(m)

      await txCartService.addShippingMethod(id, value.option_id, value.data)

      const updated = await txCartService.retrieve(id, {
        relations: ["payment_sessions"],
      })

      if (updated.payment_sessions?.length) {
        await txCartService.setPaymentSessions(id)
      }
    })

    const updatedCart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ cart: updatedCart })
  } catch (err) {
    throw err
  }
}
