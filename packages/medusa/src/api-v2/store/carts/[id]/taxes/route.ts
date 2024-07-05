import { updateTaxLinesWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchCart } from "../../helpers"
import { StoreCalculateCartTaxesType } from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreCalculateCartTaxesType>,
  res: MedusaResponse
) => {
  const workflow = updateTaxLinesWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      cart_or_cart_id: req.params.id,
      force_tax_calculation: true,
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
