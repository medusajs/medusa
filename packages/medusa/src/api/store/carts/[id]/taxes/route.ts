import { updateTaxLinesWorkflow } from "@medusajs/core-flows"
import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { refetchCart } from "../../helpers"

export const POST = async (
  req: MedusaStoreRequest<{}, HttpTypes.StoreCalculateCartTaxes>,
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
    req.queryConfig.fields,
    req
  )

  res.status(200).json({ cart })
}
