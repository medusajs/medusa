import { capturePaymentWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchPayment } from "../../helpers"
import { AdminCreatePaymentCaptureType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePaymentCaptureType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { errors } = await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      captured_by: req.auth?.actor_id,
      amount: req.validatedBody.amount,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const payment = await refetchPayment(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ payment })
}
