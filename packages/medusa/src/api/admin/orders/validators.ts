import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
  WithAdditionalData,
} from "../../utils/validators"

export const AdminGetOrdersOrderParams = createSelectParams().merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersOrderParamsType = z.infer<
  typeof AdminGetOrdersOrderParams
>

/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export const AdminGetOrdersParams = createFindParams({
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
    fulfillment_status: z.array(z.string()).optional(),
    payment_status: z.array(z.string()).optional(),
    region_id: z.array(z.string()).optional(),
    q: z.string().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
  })
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
  items: z.array(Item),
  location_id: z.string().nullish(),
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

export const AdminOrderChanges = z.object({
  id: z.union([z.string(), z.array(z.string())]).optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
  change_type: z.union([z.string(), z.array(z.string())]).optional(),
  created_at: createOperatorMap().optional(),
  updated_at: createOperatorMap().optional(),
  deleted_at: createOperatorMap().optional(),
})
export type AdminOrderChangesType = z.infer<typeof AdminOrderChanges>

export type AdminMarkOrderFulfillmentDeliveredType = z.infer<
  typeof AdminMarkOrderFulfillmentDelivered
>
export const AdminMarkOrderFulfillmentDelivered = z.object({})
