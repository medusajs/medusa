import { updateTaxLinesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  await updateTaxLinesWorkflow(req.scope).run({
    input: {
      cartId: req.params.id,
      forceTaxCalculation: true,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
