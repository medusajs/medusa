import { createPaymentSessionsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { StoreCreatePaymentSessionType } from "../../validators"
import { refetchPaymentCollection } from "../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreCreatePaymentSessionType>,
  res: MedusaResponse
) => {
  const collectionId = req.params.id
  const { context = {}, data, provider_id } = req.body

  // If the customer is logged in, we auto-assign them to the payment collection
  if (req.auth_context.actor_id) {
    ;(context as any).customer = {
      id: req.auth_context.actor_id,
    }
  }
  const workflowInput = {
    payment_collection_id: collectionId,
    provider_id: provider_id,
    data,
    context,
  }

  const { errors } = await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const paymentCollection = await refetchPaymentCollection(
    collectionId,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment_collection: paymentCollection })
}
