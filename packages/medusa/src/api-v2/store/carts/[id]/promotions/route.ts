import { updateCartPromotionsWorkflow } from "@medusajs/core-flows"
import { PromotionActions } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { StorePostCartsCartPromotionsReq } from "../../validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody as StorePostCartsCartPromotionsReq

  const { result, errors } = await workflow.run({
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

  res.status(200).json({ cart: result })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody as StorePostCartsCartPromotionsReq

  const { result, errors } = await workflow.run({
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

  res.status(200).json({ cart: result })
}
