import { createPaymentCollectionForCartWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchCart } from "../../helpers"
import { StoreUpdateCartType } from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreUpdateCartType>,
  res: MedusaResponse
) => {
  const workflow = createPaymentCollectionForCartWorkflow(req.scope)
  let cart = await refetchCart(req.params.id, req.scope, [
    "id",
    "currency_code",
    "region_id",
    "total",
  ])

  const { errors } = await workflow.run({
    input: {
      cart_id: req.params.id,
      region_id: cart.region_id,
      currency_code: cart.currency_code,
      amount: cart.total ?? 0, // TODO: This should be calculated from the cart when totals decoration is introduced
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
