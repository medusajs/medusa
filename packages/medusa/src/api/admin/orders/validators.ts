import { z } from "zod"
import {
  createFindParams,
  createOperatorMap,
  createSelectParams,
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
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
  })
)

export type AdminGetOrdersParamsType = z.infer<typeof AdminGetOrdersParams>

export const AdminArchiveOrder = z.object({
  order_id: z.string(),
})
export type AdminArchiveOrderType = z.infer<typeof AdminArchiveOrder>

export const AdminCompleteOrder = z.object({
  order_id: z.string(),
})
export type AdminCompleteOrderType = z.infer<typeof AdminArchiveOrder>

const Item = z.object({
  id: z.string(),
  quantity: z.number(),
})

export const AdminOrderCreateFulfillment = z.object({
  items: z.array(Item),
  location_id: z.string().optional(),
  no_notification: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminOrderCreateFulfillmentType = z.infer<
  typeof AdminOrderCreateFulfillment
>

const Label = z.object({
  tracking_number: z.string(),
  tracking_url: z.string(),
  label_url: z.string(),
})

export const AdminOrderCreateShipment = z.object({
  items: z.array(Item),
  labels: z.array(Label),
  no_notification: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export type AdminOrderCreateShipmentType = z.infer<
  typeof AdminOrderCreateShipment
>
