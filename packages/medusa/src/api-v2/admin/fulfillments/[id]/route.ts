import { updateFulfillmentWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchFulfillment } from "../helpers"
import { AdminUpdateFulfillmentType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateFulfillmentType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { errors } = await updateFulfillmentWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const fulfillment = await refetchFulfillment(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ fulfillment })
}
