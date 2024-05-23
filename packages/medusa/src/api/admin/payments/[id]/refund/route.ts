import { refundPaymentWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchPayment } from "../../helpers"
import { AdminCreatePaymentRefundType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePaymentRefundType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { errors } = await refundPaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      created_by: req.auth_context.actor_id,
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
