import { updateCartPromotionsWorkflow } from "@medusajs/core-flows"
import { PromotionActions, remoteQueryObjectFromString } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { defaultStoreCartFields } from "../../query-config"
import { StorePostCartsCartPromotionsReq } from "../../validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody as StorePostCartsCartPromotionsReq

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

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const workflow = updateCartPromotionsWorkflow(req.scope)
  const payload = req.validatedBody as StorePostCartsCartPromotionsReq

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

  const query = remoteQueryObjectFromString({
    entryPoint: "cart",
    fields: defaultStoreCartFields,
  })

  const [cart] = await remoteQuery(query, {
    cart: { id: req.params.id },
  })

  res.status(200).json({ cart })
}
