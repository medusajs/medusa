import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { refetchOrder } from "../helpers"

// TODO: Do we want to apply some sort of authentication here? My suggestion is that we do
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const order = await refetchOrder(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ order })
}
