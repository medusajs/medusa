import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /carts/{id}
 * operationId: "GetCartsCart"
 * summary: "Retrieve a Cart"
 * description: "Retrieves a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
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

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.retrieve(id, {
      relations: ["customer"],
    })

    // If there is a logged in user add the user to the cart
    if (req.user && req.user.customer_id) {
      if (
        !cart.customer_id ||
        !cart.email ||
        cart.customer_id !== req.user.customer_id
      ) {
        await cartService.update(id, {
          customer_id: req.user.customer_id,
        })
      }
    }

    cart = await cartService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ cart })
  } catch (err) {
    throw err
  }
}
