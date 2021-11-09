import { IsString } from "class-validator"
import { defaultFields, defaultRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /carts/{id}/payment-session
 * operationId: PostCartsCartPaymentSession
 * summary: Select a Payment Session
 * description: "Selects a Payment Session as the session intended to be used towards the completion of the Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (body) provider_id=* {string} The id of the Payment Provider.
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

  const validated = await validator(StoreSetCartPaymentSession, req.body)

  const cartService: CartService = req.scope.resolve("cartService")

  let cart = await cartService.setPaymentSession(id, validated.provider_id)
  cart = await cartService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.status(200).json({ cart })
}

export class StoreSetCartPaymentSession {
  @IsString()
  provider_id: string
}
