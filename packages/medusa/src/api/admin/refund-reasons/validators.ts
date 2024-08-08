import { z } from "zod"
import { createFindParams, createOperatorMap } from "../../utils/validators"

export type AdminCreatePaymentRefundReasonType = z.infer<
  typeof AdminCreatePaymentRefundReason
>
export const AdminCreatePaymentRefundReason = z
  .object({
    label: z.string(),
    description: z.string().nullish(),
  })
  .strict()

export type AdminUpdatePaymentRefundReasonType = z.infer<
  typeof AdminUpdatePaymentRefundReason
>
export const AdminUpdatePaymentRefundReason = z
  .object({
    label: z.string().optional(),
    description: z.string().nullish(),
  })
  .strict()

/**
 * Parameters used to filter and configure the pagination of the retrieved refund reason.
 */
export const AdminGetRefundReasonsParams = createFindParams({
  limit: 15,
  offset: 0,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    q: z.string().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)
export type AdminGetRefundReasonsParamsType = z.infer<
  typeof AdminGetRefundReasonsParams
>
