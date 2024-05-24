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
  await refundPaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      created_by: req.auth_context.actor_id,
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
