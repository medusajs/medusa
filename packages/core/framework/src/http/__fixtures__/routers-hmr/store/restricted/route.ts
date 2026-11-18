import { MedusaRequest, MedusaResponse } from "../../../../types"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    allowed: req.allowed,
    restrictedFields: req.restrictedFields?.list(),
    storeRelationsLimit: req.storeRelationsLimit,
  })
}
