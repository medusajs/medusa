import { addPromotionsToCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { StorePostCartsCartPromotionsReq } from "../../validators"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const workflow = addPromotionsToCartWorkflow(req.scope)
  const requestParams = req.validatedBody as StorePostCartsCartPromotionsReq

  const { result, errors } = await workflow.run({
    input: {
      promoCodes: requestParams.promo_codes,
      cartId: req.params.id,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ cart: result })
}
