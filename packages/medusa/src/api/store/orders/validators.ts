import { z } from "@medusajs/framework/zod"
import { createFindParams, createSelectParams } from "../../utils/validators"
import { applyAndAndOrOperators } from "../../utils/common-validators"

export const StoreGetOrderParams = createSelectParams()
export type StoreGetOrderParamsType = z.infer<typeof StoreGetOrderParams>

export const StoreGetOrdersParamsFields = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
})

export const StoreGetOrdersParams = createFindParams({
  offset: 0,
  limit: 50,
})
  .merge(StoreGetOrdersParamsFields)
  .merge(applyAndAndOrOperators(StoreGetOrdersParamsFields))

export type StoreGetOrdersParamsType = z.infer<typeof StoreGetOrdersParams>

export type StoreAcceptOrderTransferType = z.infer<
  typeof StoreAcceptOrderTransfer
>
export const StoreAcceptOrderTransfer = z.object({
  token: z.string().min(1),
})

export type StoreRequestOrderTransferType = z.infer<
  typeof StoreRequestOrderTransfer
>
export const StoreRequestOrderTransfer = z.object({
  description: z.string().optional(),
})

export type StoreCancelOrderTransferRequestType = z.infer<
  typeof StoreCancelOrderTransferRequest
>
export const StoreCancelOrderTransferRequest = z.object({})

export type StoreDeclineOrderTransferRequestType = z.infer<
  typeof StoreDeclineOrderTransferRequest
>
export const StoreDeclineOrderTransferRequest = z.object({
  token: z.string().min(1),
})
