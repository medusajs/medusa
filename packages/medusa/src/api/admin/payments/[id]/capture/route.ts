import { capturePaymentWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { refetchPayment } from "../../helpers"
import { AdminCreatePaymentCaptureType } from "../../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePaymentCaptureType>,
  res: MedusaResponse<HttpTypes.AdminPaymentResponse>
) => {
  const { id } = req.params

  await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      captured_by: req.auth_context.actor_id,
      amount: req.validatedBody.amount,
    },
  })

  const payment = await refetchPayment(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment })
}
