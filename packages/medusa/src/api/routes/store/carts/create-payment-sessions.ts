import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { Request } from "@interfaces/http"

/**
 * @oas [post] /carts/{id}/payment-sessions
 * operationId: "PostCartsCartPaymentSessions"
 * summary: "Initialize Payment Sessions"
 * description: "Creates Payment Sessions for each of the available Payment Providers in the Cart's Region."
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
export default async (req: Request, res) => {
  const { id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")

  await cartService.setPaymentSessions(id)

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}
