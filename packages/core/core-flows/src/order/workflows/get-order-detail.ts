import type { OrderDetailDTO } from "@medusajs/framework/types"
import { deduplicate } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../utils/aggregate-status"

/**
 * The data to retrieve an order's details.
 */
export type GetOrderDetailWorkflowInput = {
  /**
   * Additional filters to apply on the retrieved order.
   */
  filters?: {
    /**
     * Whether to retrieve a draft order.
     */
    is_draft_order?: boolean
    /**
     * The ID of the customer that the order belongs to.
     */
    customer_id?: string
  }
  /**
   * The fields and relations to retrieve in the order. These fields
   * are passed to [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
   * so you can pass names of custom models linked to the order.
   */
  fields: string[]
  /**
   * The ID of the order to retrieve.
   */
  order_id: string
  /**
   * The version of the order to retrieve. If not provided, the latest version
   * of the order will be retrieved.
   */
  version?: number
}

export const getOrderDetailWorkflowId = "get-order-detail"
/**
 * This workflow retrieves an order's details. It's used by many API routes, including
 * [Get an Order Admin API Route](https://docs.medusajs.com/api/admin/orders/get-an-order), and
 * [Get an Order Store API Route](https://docs.medusajs.com/api/store/orders/get-an-order).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to retrieve an
 * order's details in your custom flows.
 *
 * @example
 * const { result } = await getOrderDetailWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     fields: ["id", "status", "items"]
 *   }
 * })
 *
 * @summary
 *
 * Retrieve an order's details.
 */
export const getOrderDetailWorkflow = createWorkflow(
  getOrderDetailWorkflowId,
  (
    input: WorkflowData<GetOrderDetailWorkflowInput>
  ): WorkflowResponse<OrderDetailDTO> => {
    const fields = transform(input, ({ fields }) => {
      return deduplicate([
        ...fields,
        "id",
        "status",
        "version",
        "payment_collections.*",
        "fulfillments.*",
      ])
    })

    const variables = transform({ input }, ({ input }) => {
      return { ...input.filters, id: input.order_id, version: input.version }
    })

    const { data: order } = useQueryGraphStep({
      entity: "order",
      filters: variables,
      fields: fields,
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-order" })

    const aggregatedOrder = transform({ order }, ({ order }) => {
      const order_ = order as OrderDetailDTO

      order_.payment_status = getLastPaymentStatus(
        order_
      ) as OrderDetailDTO["payment_status"]
      order_.fulfillment_status = getLastFulfillmentStatus(
        order_
      ) as OrderDetailDTO["fulfillment_status"]
      return order_
    })

    return new WorkflowResponse(aggregatedOrder)
  }
)
