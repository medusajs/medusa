import { createOrderFulfillmentWorkflow } from "@zjedene-medusa/core-flows"
import { AdditionalData, HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateOrderFulfillment & AdditionalData,
    HttpTypes.AdminGetOrderParams
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  await createOrderFulfillmentWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: req.params.id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
