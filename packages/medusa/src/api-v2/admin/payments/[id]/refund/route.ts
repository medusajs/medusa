import { refundPaymentWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultAdminPaymentFields } from "../../query-config"
import { AdminPostPaymentsRefundsReq } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostPaymentsRefundsReq>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id } = req.params

  const { errors } = await refundPaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      created_by: req.auth?.actor_id,
      amount: req.validatedBody.amount,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: "payments",
    variables: { id },
    fields: defaultAdminPaymentFields,
  })

  const [payment] = await remoteQuery(query)

  res.status(200).json({ payment })
}
