import { capturePaymentWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchPayment } from "../../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCapturePayment,
    HttpTypes.SelectParams
  >,
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

  const payment = await refetchPayment(id, req.scope, req.queryConfig.fields)

  res.status(200).json({ payment })
}
