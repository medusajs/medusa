import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchProduct, wrapProductsWithPrices } from "../helpers"
import { StoreGetProductsParamsType } from "../validators"

export const GET = async (
  req: MedusaRequest<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  let product = await refetchProduct(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  ;[product] = await wrapProductsWithPrices(
    [product],
    req.scope,
    req.pricingContext!
  )

  res.json({ product })
}
