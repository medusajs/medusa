import { z } from "zod"
import {
  applyAndAndOrOperators,
  booleanString,
} from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
} from "../../utils/validators"

export type AdminGetPaymentParamsType = z.infer<typeof AdminGetPaymentParams>
export const AdminGetPaymentParams = createSelectParams()

export const AdminGetPaymentsParamsFields = z.object({
  q: z.string().optional(),
  id: z.union([z.string(), z.array(z.string())]).optional(),
  payment_session_id: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})

export type AdminGetPaymentsParamsType = z.infer<typeof AdminGetPaymentsParams>
export const AdminGetPaymentsParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetPaymentsParamsFields)
  .merge(applyAndAndOrOperators(AdminGetPaymentsParamsFields))

export const AdminGetPaymentProvidersParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  is_enabled: booleanString().optional(),
})

export type AdminGetPaymentProvidersParamsType = z.infer<
  typeof AdminGetPaymentProvidersParams
>
export const AdminGetPaymentProvidersParams = createFindParams({
  limit: 20,
  offset: 0,
})
  .merge(AdminGetPaymentProvidersParamsFields)
  .merge(applyAndAndOrOperators(AdminGetPaymentProvidersParamsFields))

export type AdminCreatePaymentCaptureType = z.infer<
  typeof AdminCreatePaymentCapture
>
export const AdminCreatePaymentCapture = z
  .object({
    amount: z.number().optional(),
  })
  .strict()

export type AdminCreatePaymentRefundType = z.infer<
  typeof AdminCreatePaymentRefund
>
export const AdminCreatePaymentRefund = z
  .object({
    amount: z.number().optional(),
    refund_reason_id: z.string().optional(),
    note: z.string().optional(),
  })
  .strict()

export type AdminCreatePaymentRefundReasonType = z.infer<
  typeof AdminCreatePaymentRefundReason
>
export const AdminCreatePaymentRefundReason = z
  .object({
    label: z.string(),
    description: z.string().optional(),
  })
  .strict()
