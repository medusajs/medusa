import { z } from "@medusajs/framework/zod"
import { AddressPayload } from "../../utils/common-validators"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"
import { isString } from "@medusajs/framework/utils"

export const AdminGetOrdersOrderParams = createSelectParams().merge(
  z.object({
    version: z.preprocess((val) => {
      if (isString(val) && val) {
        return parseInt(val)
      }
      return val
    }, z.number().optional()),
  })
)

export type AdminGetOrdersOrderParamsType = z.infer<
  typeof AdminGetOrdersOrderParams
>

export const AdminGetOrdersOrderItemsParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    item_id: z.union([z.string(), z.array(z.string())]).optional(),
    version: z.number().optional(),
  })
)

export type AdminGetOrdersOrderItemsParamsType = z.infer<
  typeof AdminGetOrdersOrderItemsParams
>

export const AdminGetOrderShippingOptionList = z.object({})

export type AdminGetOrderShippingOptionListType = z.infer<
  typeof AdminGetOrderShippingOptionList
>

const AdminGetOrdersParamsBase = createFindParams({
  limit: 15,
  offset: 0,
}).merge(
  z.object({
    id: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    status: z
      .union([z.string(), z.array(z.string()), createOperatorMap()])
      .optional(),
    name: z.union([z.string(), z.array(z.string())]).optional(),
    sales_channel_id: z.array(z.string()).optional(),
    region_id: z.union([z.string(), z.array(z.string())]).optional(),
    customer_id: z.union([z.string(), z.array(z.string())]).optional(),
    q: z.string().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    total: createOperatorMap().optional(),
  })
)

type AdminGetOrdersParamsInput = z.infer<typeof AdminGetOrdersParamsBase>

const AdminGetOrdersParamsTransform = (v: AdminGetOrdersParamsInput) => {
  const { total, ...rest } = v
  return {
    ...rest,
    ...(total ? { summary: { totals: { current_order_total: total } } } : {}),
  }
}

export const AdminGetOrdersParams = AdminGetOrdersParamsBase.transform(
  AdminGetOrdersParamsTransform
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>

export const AdminCompleteOrder = WithAdditionalData(z.object({}))

const Item = z.object({
  id: z.string(),
  quantity: z.number(),
})

export type AdminOrderCreateFulfillmentType = z.infer<
  typeof OrderCreateFulfillment
>
export const OrderCreateFulfillment = z.object({
  items: z.array(Item).min(1),
  location_id: z.string().nullish(),
  shipping_option_id: z.string().optional(),
  no_notification: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export const AdminOrderCreateFulfillment = WithAdditionalData(
  OrderCreateFulfillment
)

const Label = z.object({
  tracking_number: z.string(),
  tracking_url: z.string(),
  label_url: z.string(),
})

export type AdminOrderCreateShipmentType = z.infer<typeof OrderCreateShipment>
export const OrderCreateShipment = z.object({
  items: z.array(Item),
  labels: z.array(Label).optional(),
  no_notification: z.boolean().optional(),
  metadata: z.record(z.unknown()).nullish(),
})
export const AdminOrderCreateShipment = WithAdditionalData(OrderCreateShipment)

export type AdminOrderCancelFulfillmentType = z.infer<
  typeof OrderCancelFulfillment
>
export const OrderCancelFulfillment = z.object({
  no_notification: z.boolean().optional(),
})
export const AdminOrderCancelFulfillment = WithAdditionalData(
  OrderCancelFulfillment
)

export const AdminOrderChangesParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    change_type: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminOrderChangesType = z.infer<typeof AdminOrderChangesParams>

export type AdminMarkOrderFulfillmentDeliveredType = z.infer<
  typeof AdminMarkOrderFulfillmentDelivered
>

export const AdminMarkOrderFulfillmentDelivered = z.object({})

export type AdminTransferOrderType = z.infer<typeof AdminTransferOrder>
export const AdminTransferOrder = z.object({
  customer_id: z.string(),
  description: z.string().optional(),
  internal_note: z.string().optional(),
})

export type AdminCancelOrderTransferRequestType = z.infer<
  typeof AdminCancelOrderTransferRequest
>
export const AdminCancelOrderTransferRequest = z.object({})

export type AdminUpdateOrderType = z.infer<typeof AdminUpdateOrder>
export const AdminUpdateOrder = z.object({
  email: z.string().optional(),
  shipping_address: AddressPayload.optional(),
  billing_address: AddressPayload.optional(),
  locale: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
})

export type AdminCreateOrderCreditLinesType = z.infer<
  typeof AdminCreateOrderCreditLines
>
export const AdminCreateOrderCreditLines = z.object({
  amount: z.number(),
  reference: z.string(),
  reference_id: z.string(),
  metadata: z.record(z.unknown()).nullish(),
})
