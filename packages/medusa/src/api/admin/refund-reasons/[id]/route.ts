import {
  deleteRefundReasonsWorkflow,
  updateRefundReasonsWorkflow,
} from "@zjedene-medusa/core-flows"
import { HttpTypes, RefundReasonResponse } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@zjedene-medusa/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminRefundReasonParams>,
  res: MedusaResponse<RefundReasonResponse>
) => {
  const refund_reason = await refetchEntity({
    entity: "refund_reason",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.json({ refund_reason })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateRefundReason,
    HttpTypes.AdminRefundReasonParams
  >,
  res: MedusaResponse<RefundReasonResponse>
) => {
  const { id } = req.params

  await updateRefundReasonsWorkflow(req.scope).run({
    input: [
      {
        ...req.validatedBody,
        id,
      },
    ],
  })

  const refund_reason = await refetchEntity({
    entity: "refund_reason",
    idOrFilter: req.params.id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.json({ refund_reason })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminRefundReasonDeleteResponse>
) => {
  const { id } = req.params
  const input = { ids: [id] }

  await deleteRefundReasonsWorkflow(req.scope).run({ input })

  res.json({
    id,
    object: "refund_reason",
    deleted: true,
  })
}
