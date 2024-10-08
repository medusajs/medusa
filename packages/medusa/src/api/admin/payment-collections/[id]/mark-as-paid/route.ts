import { markPaymentCollectionAsPaid } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { AdminMarkPaymentCollectionPaidType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminMarkPaymentCollectionPaidType>,
  res: MedusaResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { id } = req.params

  await markPaymentCollectionAsPaid(req.scope).run({
    input: {
      ...req.body,
      payment_collection_id: id,
      captured_by: req.auth_context.actor_id,
    },
  })

  const paymentCollection = await refetchEntity(
    "payment_collection",
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment_collection: paymentCollection })
}
