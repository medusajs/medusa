import { updateCartPromotionsWorkflow } from "@medusajs/core-flows"
import { PromotionActions } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchCart } from "../../helpers"
import {
  StoreAddCartPromotionsType,
  StoreRemoveCartPromotionsType,
} from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreAddCartPromotionsType>,
  res: MedusaResponse
) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody

  const { errors } = await workflow.run({
    input: {
      promoCodes: payload.promo_codes,
      cartId: req.params.id,
      action: PromotionActions.ADD,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}

export const DELETE = async (
  req: MedusaRequest<StoreRemoveCartPromotionsType>,
  res: MedusaResponse
) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody

  const { errors } = await workflow.run({
    input: {
      promoCodes: payload.promo_codes,
      cartId: req.params.id,
      action: PromotionActions.REMOVE,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
