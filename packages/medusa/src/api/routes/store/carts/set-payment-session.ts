import { IsString } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { decorateLineItemsWithTotals } from "./decorate-line-items-with-totals"
import { EntityManager } from "typeorm";

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

  const validated = await validator(
    StorePostCartsCartPaymentSessionReq,
    req.body
  )

  const cartService: CartService = req.scope.resolve("cartService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await cartService.withTransaction(transactionManager).setPaymentSession(id, validated.provider_id)
  })

  const cart = await cartService.retrieve(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  const data = await decorateLineItemsWithTotals(cart, req)
  res.status(200).json({ cart: data })
}

export class StorePostCartsCartPaymentSessionReq {
  @IsString()
  provider_id: string
}
