import { createOrderPaymentCollectionWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { AdminCreatePaymentCollectionType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePaymentCollectionType>,
  res: MedusaResponse<HttpTypes.AdminPaymentCollectionResponse>
) => {
  const { result } = await createOrderPaymentCollectionWorkflow(req.scope).run({
    input: req.body,
  })

  const paymentCollection = await refetchEntity(
    "payment_collection",
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment_collection: paymentCollection })
}
