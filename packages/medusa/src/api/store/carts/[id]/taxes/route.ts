import { updateTaxLinesWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  await updateTaxLinesWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      force_tax_calculation: true,
    },
  })

  const cart = await refetchCart(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ cart })
}
