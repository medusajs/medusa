import { requestOrderTransferWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"

/**
 * Request a transfer of an order to a customer.
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminRequestOrderTransfer,
    HttpTypes.AdminGetOrderParams
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  await requestOrderTransferWorkflow(req.scope).run({
    input: {
      order_id: req.params.id,
      customer_id: req.validatedBody.customer_id,
      logged_in_user: req.auth_context.actor_id,
      description: req.validatedBody.description,
      internal_note: req.validatedBody.internal_note,
      update_order_email: req.validatedBody.update_order_email,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: req.queryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}
