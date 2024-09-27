import { updatePaymentSessionWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { StoreUpdatePaymentSessionType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreUpdatePaymentSessionType>,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const { id, session_id } = req.params
  const { data, provider_id } = req.body

  const workflowInput = {
    id: session_id,
    data,
    provider_id,
  }

  await updatePaymentSessionWorkflow(req.scope).run({
    input: workflowInput,
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const result = await query.graph({
    entity: "payment_collection",
    filters: { id },
    fields: req.remoteQueryConfig.fields,
  })

  res.status(200).json({ payment_collection: result.data[0] })
}
