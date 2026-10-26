import type { OrderDetailDTO, OrderDTO } from "@medusajs/framework/types"
import { deduplicate, isPresent } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  getLastFulfillmentStatus,
  getLastPaymentStatus,
} from "../utils/aggregate-status"

const toStatusArray = (value: unknown): string[] => {
  if (!isPresent(value)) {
    return []
  }
  return Array.isArray(value) ? (value as string[]) : [value as string]
}

/**
 * The retrieved list of orders. If you passed pagination configurations in the
 * input, the response will return an object that includes the list of
 * orders and their pagination details. Otherwise, only the list of orders are returned.
 */
export type GetOrdersListWorkflowOutput =
  | OrderDTO[]
  | {
      /**
       * The list of orders.
       */
      rows: OrderDTO[]
      /**
       * Pagination details.
       */
      metadata: {
        /**
         * The total number of orders.
         */
        count: number
        /**
         * The number of items skipped before retrieving the returned orders.
         */
        skip: number
        /**
         * The number of items to retrieve.
         */
        take: number
      }
    }

export type GetOrdersListWorkflowInput = {
  /**
   * The fields and relations to retrieve in the order. These fields
   * are passed to [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
   * so you can pass names of custom models linked to the order.
   */
  fields: string[]
  /**
   * Filters and pagination configurations to apply on the retrieved orders.
   */
  variables?: Record<string, any> & {
    /**
     * The number of items to skip before retrieving the orders.
     */
    skip?: number
    /**
     * The number of items to retrieve.
     */
    take?: number
    /**
     * Fields to sort the orders by. The key is the field name, and the value is either
     * `ASC` for ascending order or `DESC` for descending order.
     */
    order?: Record<string, string>
  }
}

export const getOrdersListWorkflowId = "get-orders-list"
/**
 * This workflow retrieves a list of orders. It's used by the
 * [List Orders Admin API Route](https://docs.medusajs.com/api/admin/orders/list-orders), and the
 * [List Orders Store API Route](https://docs.medusajs.com/api/store/orders/list-orders).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to retrieve a list of
 * orders in your custom flows. For example, you can retrieve the list of orders to export them
 * to a third-party system.
 *
 * @example
 * To retrieve the list of orders:
 *
 * ```ts
 * const { result } = await getOrdersListWorkflow(container)
 * .run({
 *   input: {
 *     fields: ["id", "status", "items"],
 *   }
 * })
 * ```
 *
 * To retrieve the list of orders with pagination:
 *
 * ```ts
 * const { result } = await getOrdersListWorkflow(container)
 * .run({
 *   input: {
 *     fields: ["id", "status", "items"],
 *     variables: {
 *       skip: 0,
 *       take: 15,
 *     }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Retrieve a list of orders.
 */
export const getOrdersListWorkflow = createWorkflow(
  getOrdersListWorkflowId,
  (
    input: WorkflowData<GetOrdersListWorkflowInput>
  ): WorkflowResponse<GetOrdersListWorkflowOutput> => {
    const fields = transform(input, ({ fields }) => {
      return deduplicate([
        ...fields,
        "id",
        "status",
        "version",
        "items.*",
        "payment_collections.status",
        "payment_collections.amount",
        "payment_collections.captured_amount",
        "payment_collections.refunded_amount",
        "fulfillments.packed_at",
        "fulfillments.shipped_at",
        "fulfillments.delivered_at",
        "fulfillments.canceled_at",
      ])
    })

    /**
     * `fulfillment_status` and `payment_status` aren't persisted columns on
     * the order - they're computed below from `payment_collections` and
     * `fulfillments` once those relations are fetched. The remote query has
     * no column to filter on, so these are pulled out of the filters here
     * and applied as an in-memory filter (with in-memory pagination) once
     * the statuses have been computed.
     */
    const remoteQueryInput = transform(input, ({ variables }) => {
      const { filters, skip, take, ...restVariables } = variables ?? {}
      const { fulfillment_status, payment_status, ...restFilters } =
        filters ?? {}

      const statusFilter = {
        fulfillment_status: toStatusArray(fulfillment_status),
        payment_status: toStatusArray(payment_status),
      }
      const hasStatusFilter =
        !!statusFilter.fulfillment_status.length ||
        !!statusFilter.payment_status.length

      return {
        queryVariables: {
          ...restVariables,
          filters: restFilters,
          // Defer DB-level pagination until the in-memory status filter has
          // been applied, otherwise matching rows outside the DB-level page
          // would be silently dropped.
          ...(hasStatusFilter ? {} : { skip, take }),
        },
        statusFilter: hasStatusFilter ? statusFilter : null,
        pagination: { skip, take },
      }
    })

    const orders: OrderDTO[] = useRemoteQueryStep({
      entry_point: "orders",
      fields,
      variables: remoteQueryInput.queryVariables,
      list: true,
    })

    const aggregatedOrders = transform(
      { orders, input, remoteQueryInput },
      ({ orders, input, remoteQueryInput }) => {
        const fields = input.fields
        const requiredPaymentFields = fields.some((f) =>
          f.includes("payment_collections")
        )
        const requiredFulfillmentFields = fields.some((f) =>
          f.includes("fulfillments")
        )

        const orders_ = orders as any
        const isPaginated = !!orders_?.rows
        let data: OrderDetailDTO[] = isPaginated ? orders_.rows : orders_

        for (const order of data) {
          const order_ = order as OrderDetailDTO

          order_.payment_status = getLastPaymentStatus(
            order_
          ) as OrderDetailDTO["payment_status"]
          order_.fulfillment_status = getLastFulfillmentStatus(
            order_
          ) as OrderDetailDTO["fulfillment_status"]
        }

        const { statusFilter, pagination } = remoteQueryInput

        if (statusFilter) {
          data = data.filter((order) => {
            const matchesFulfillment =
              !statusFilter.fulfillment_status.length ||
              statusFilter.fulfillment_status.includes(
                order.fulfillment_status as unknown as string
              )
            const matchesPayment =
              !statusFilter.payment_status.length ||
              statusFilter.payment_status.includes(
                order.payment_status as unknown as string
              )

            return matchesFulfillment && matchesPayment
          })
        }

        for (const order of data) {
          const order_ = order as any
          if (!requiredPaymentFields) {
            delete order_.payment_collections
          }
          if (!requiredFulfillmentFields) {
            delete order_.fulfillments
          }
        }

        if (!statusFilter) {
          return orders
        }

        // The remote query was called without pagination above (so the
        // in-memory filter above doesn't drop matches outside the DB-level
        // page), so whether the *caller* wanted a paginated response has to
        // be read from the original pagination input, not from the shape
        // the remote query happened to return.
        const callerWantsPagination =
          pagination.skip !== undefined || pagination.take !== undefined

        if (!callerWantsPagination) {
          return data
        }

        const skip = pagination.skip ?? 0
        const take = pagination.take
        const count = data.length
        const pagedData =
          take === undefined ? data.slice(skip) : data.slice(skip, skip + take)

        return {
          rows: pagedData,
          metadata: {
            count,
            skip,
            take: take ?? count,
          },
        }
      }
    )

    return new WorkflowResponse(aggregatedOrders)
  }
)
