import { createFulfillmentWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchFulfillment } from "./helpers"
import { AdminCreateFulfillmentType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateFulfillmentType>,
  res: MedusaResponse<HttpTypes.AdminFulfillmentResponse>
) => {
  const { result: fullfillment } = await createFulfillmentWorkflow(
    req.scope
  ).run({
    input: req.validatedBody,
  })

  const fulfillment = await refetchFulfillment(
    fullfillment.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ fulfillment })
}
