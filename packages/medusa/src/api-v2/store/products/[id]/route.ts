import { isPresent } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchProduct } from "../helpers"
import { StoreGetProductsParamsType } from "../validators"

export const GET = async (
  req: MedusaRequest<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  const context = isPresent(req.pricingContext)
    ? {
        "variants.calculated_price": { context: req.pricingContext },
      }
    : undefined

  const product = await refetchProduct(
    {
      id: req.params.id,
      context,
    },
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ product })
}
