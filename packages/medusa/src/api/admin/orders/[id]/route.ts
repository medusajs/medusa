import {
  getOrderDetailWorkflow,
  updateOrderWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { AdminOrder, HttpTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminGetOrderDetailsParams
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const workflow = getOrderDetailWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
      version: req.validatedQuery.version as number,
    },
  })

  res.status(200).json({ order: result as HttpTypes.AdminOrder })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateOrder,
    HttpTypes.AdminGetOrderDetailsParams
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await updateOrderWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      user_id: req.auth_context.actor_id,
      id: req.params.id,
    },
  })

  const result = await query.graph({
    entity: "order",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order: result.data[0] as AdminOrder })
}
