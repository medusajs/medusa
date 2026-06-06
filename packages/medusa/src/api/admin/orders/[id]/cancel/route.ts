import { cancelOrderWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.AdminGetOrderParams>,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const input = {
    order_id: req.params.id,
    canceled_by: req.auth_context.actor_id,
  }

  await cancelOrderWorkflow(req.scope).run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.status(200).json({ order })
}
