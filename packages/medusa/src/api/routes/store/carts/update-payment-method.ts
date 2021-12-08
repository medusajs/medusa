import { IsOptional, IsString } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /store/carts/{id}
 * operationId: PostCartsCartPaymentMethodUpdate
 * summary: Update a Cart"
 * description: "Updates a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - provider_id
 *         properties:
 *           provider_id:
 *             type: string
 *             description: The id of the Payment Provider.
 *           data:
 *             type: object
 *             description: ""
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

  const validated = await validator(
    StorePostCartsCartPaymentMethodUpdateReq,
    req.body
  )

  const cartService: CartService = req.scope.resolve("cartService")

  let cart = await cartService.setPaymentMethod(id, validated)
  cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart })
}

export class StorePostCartsCartPaymentMethodUpdateReq {
  @IsString()
  provider_id: string

  @IsOptional()
  data?: object
}
