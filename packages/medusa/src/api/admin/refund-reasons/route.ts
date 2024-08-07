import { createRefundReasonsWorkflow } from "@medusajs/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import {
  PaginatedResponse,
  RefundReasonResponse,
  RefundReasonsResponse,
} from "@medusajs/types"
import { refetchEntities, refetchEntity } from "../../utils/refetch-entity"
import { AdminCreatePaymentRefundReasonType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<PaginatedResponse<RefundReasonsResponse>>
) => {
  const { rows: refund_reasons, metadata } = await refetchEntities(
    "refund_reasons",
    req.filterableFields,
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )

  res.json({
    refund_reasons,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePaymentRefundReasonType>,
  res: MedusaResponse<RefundReasonResponse>
) => {
  const {
    result: [refundReason],
  } = await createRefundReasonsWorkflow(req.scope).run({
    input: { data: [req.validatedBody] },
  })

  const refund_reason = await refetchEntity(
    "refund_reason",
    refundReason.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ refund_reason })
}
