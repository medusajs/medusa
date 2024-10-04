import { updateCartPromotionsWorkflow } from "@medusajs/core-flows"
import { PromotionActions } from "@medusajs/framework/utils"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchCart } from "../../helpers"
import {
  StoreAddCartPromotionsType,
  StoreRemoveCartPromotionsType,
} from "../../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: MedusaRequest<StoreAddCartPromotionsType>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody

  await workflow.run({
    input: {
      promo_codes: payload.promo_codes,
      cart_id: req.params.id,
      action: PromotionActions.ADD,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}

export const DELETE = async (
  req: MedusaRequest<StoreRemoveCartPromotionsType>,
  res: MedusaResponse<{
    cart: HttpTypes.StoreCart
  }>
) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody

  await workflow.run({
    input: {
      promo_codes: payload.promo_codes,
      cart_id: req.params.id,
      action: PromotionActions.REMOVE,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
