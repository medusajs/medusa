import { capturePaymentWorkflow } from "@medusajs/core-flows"
import { Modules } from "@medusajs/modules-sdk"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultAdminPaymentFields } from "../../query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id } = req.params

  const { errors } = await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id: id,
      captured_by: req.auth?.actor_id,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const query = remoteQueryObjectFromString({
    entryPoint: Modules.PAYMENT,
    variables: { id },
    fields: defaultAdminPaymentFields,
  })

  const [payment] = await remoteQuery(query)

  res.status(200).json({ payment })
}
