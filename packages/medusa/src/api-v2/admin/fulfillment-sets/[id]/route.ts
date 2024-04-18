import { AdminFulfillmentSetsDeleteResponse } from "@medusajs/types"
import { deleteFulfillmentSetsWorkflow } from "@medusajs/core-flows"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminFulfillmentSetsDeleteResponse>
) => {
  const { id } = req.params

  const { errors } = await deleteFulfillmentSetsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "fulfillment_set",
    deleted: true,
  })
}
