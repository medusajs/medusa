import { deleteFulfillmentSetsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminFulfillmentSetDeleteResponse>
) => {
  const { id } = req.params

  await deleteFulfillmentSetsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "fulfillment_set",
    deleted: true,
  })
}
