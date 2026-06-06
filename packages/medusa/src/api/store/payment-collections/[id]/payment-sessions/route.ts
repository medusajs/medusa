import { createPaymentSessionsWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchPaymentCollection } from "../../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.StoreInitializePaymentSession,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const collectionId = req.params.id
  const { provider_id, data } = req.body

  const workflowInput = {
    payment_collection_id: collectionId,
    provider_id: provider_id,
    customer_id: req.auth_context?.actor_id,
    data,
  }

  await createPaymentSessionsWorkflow(req.scope).run({
    input: workflowInput,
  })

  const paymentCollection = await refetchPaymentCollection(
    collectionId,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    payment_collection: paymentCollection as HttpTypes.StorePaymentCollection,
  })
}
