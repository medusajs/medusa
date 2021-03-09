import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"

import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /store/carts/{id}
 * operationId: PostCartsCart
 * summary: Update a Cart"
 * description: "Updates a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           region_id:
 *             type: string
 *             description: The id of the Region to create the Cart in.
 *           country_code:
 *             type: string
 *             description: "The 2 character ISO country code to create the Cart in."
 *           email:
 *             type: string
 *             description: "An email to be used on the Cart."
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           shipping_address:
 *             description: "The Address to be used for shipping."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           gift_cards:
 *             description: "An array of Gift Card codes to add to the Cart."
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: "The code that a Gift Card is identified by."
 *                   type: string
 *           discounts:
 *             description: "An array of Discount codes to add to the Cart."
 *             type: array
 *             items:
 *               properties:
 *                 code:
 *                   description: "The code that a Discount is identifed by."
 *                   type: string
 *           customer_id:
 *             description: "The id of the Customer to associate the Cart with."
 *             type: string
 * tags:
 *   - Cart
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
 */
export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    region_id: Validator.string().optional(),
    country_code: Validator.string().optional(),
    email: Validator.string()
      .email()
      .optional(),
    billing_address: Validator.object().optional(),
    shipping_address: Validator.object().optional(),
    gift_cards: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    discounts: Validator.array()
      .items({
        code: Validator.string(),
      })
      .optional(),
    customer_id: Validator.string().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")

    // Update the cart
    await cartService.update(id, value)

    // If the cart has payment sessions update these
    const updated = await cartService.retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length && !value.region_id) {
      await cartService.setPaymentSessions(id)
    }

    const cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ cart })
  } catch (err) {
    console.log(err)
    throw err
  }
}
