import { cancelFulfillmentsWorkflow } from "@medusajs/core-flows"
import { AdminFulfillmentDeleteResponse } from "@medusajs/types"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminFulfillmentDeleteResponse>
) => {
  const { id } = req.params
  const { errors } = await cancelFulfillmentsWorkflow(req.scope).run({
    input: { ids: [id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id,
    object: "fulfillment",
    deleted: true,
  })
}
