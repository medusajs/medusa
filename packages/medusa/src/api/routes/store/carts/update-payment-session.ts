import { IsObject } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/payment-sessions/{provider_id}
 * operationId: PostCartsCartPaymentSessionUpdate
 * summary: Update a Payment Session
 * description: "Updates a Payment Session with additional data."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) provider_id=* {string} The id of the payment provider.
 *   - (body) data=* {object} The data to update the payment session with.
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
  const { id, provider_id } = req.params

  const validated = await validator(
    StorePostCartsCartPaymentSessionUpdateReq,
    req.body
  )

  const cartService: CartService = req.scope.resolve("cartService")

  await cartService.setPaymentSession(id, provider_id)
  await cartService.updatePaymentSession(id, validated.data)

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}

export class StorePostCartsCartPaymentSessionUpdateReq {
  @IsObject()
  data: object
}
