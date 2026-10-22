import { updatePaymentSessionClientDataWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { refetchPaymentCollection } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.StoreUpdatePaymentSession,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.StorePaymentCollectionResponse>
) => {
  const { id, session_id } = req.params

  await updatePaymentSessionClientDataWorkflow(req.scope).run({
    input: {
      payment_collection_id: id,
      payment_session_id: session_id,
      client_data: req.validatedBody.client_data,
    },
  })

  const paymentCollection = await refetchPaymentCollection(
    id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    payment_collection: paymentCollection as HttpTypes.StorePaymentCollection,
  })
}
