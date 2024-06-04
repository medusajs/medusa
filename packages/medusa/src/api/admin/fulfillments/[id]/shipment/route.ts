import { createShipmentWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchFulfillment } from "../../helpers"
import { AdminCreateShipmentType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateShipmentType>,
  res: MedusaResponse<HttpTypes.AdminFulfillmentResponse>
) => {
  const { id } = req.params

  await createShipmentWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
  })

  const fulfillment = await refetchFulfillment(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ fulfillment })
}
