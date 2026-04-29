import {
  getOrderDetailWorkflow,
  updateDraftOrderWorkflow,
  deleteDraftOrdersWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest<HttpTypes.AdminDraftOrderParams>,
  res: MedusaResponse<HttpTypes.AdminDraftOrderResponse>
) => {
  const workflow = getOrderDetailWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      order_id: req.params.id,
      version: req.validatedQuery.version as number,
      filters: {
        is_draft_order: true,
      },
    },
  })

  res.status(200).json({ draft_order: result as HttpTypes.AdminDraftOrder })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateDraftOrder,
    HttpTypes.AdminDraftOrderParams
  >,
  res: MedusaResponse<HttpTypes.AdminDraftOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await updateDraftOrderWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      user_id: req.secret_key_context?.created_by ?? req.auth_context.actor_id,
      id: req.params.id,
    },
  })

  const result = await query.graph({
    entity: "order",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res
    .status(200)
    .json({ draft_order: result.data[0] as HttpTypes.AdminDraftOrder })
}

/**
 * @since 2.8.4
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  await deleteDraftOrdersWorkflow(req.scope).run({
    input: {
      order_ids: [id],
    },
  })

  res.status(200).json({
    id,
    object: "draft-order",
    deleted: true,
  })
}
