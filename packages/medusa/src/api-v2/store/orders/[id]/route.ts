import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchOrder } from "../helpers"
import { StoreGetOrdersParamsType } from "../validators"

// TODO: Do we want to apply some sort of authentication here? My suggestion is that we do
export const GET = async (
  req: MedusaRequest<StoreGetOrdersParamsType>,
  res: MedusaResponse
) => {
  const order = await refetchOrder(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ order })
}
