import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { createOrderExchangesStep } from "../../steps/exchange/create-exchange"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

/**
 * The data to validate that an exchange can be requested for an order.
 */
export type BeginOrderExchangeValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
}

/**
 * This step validates that an exchange can be requested for an order.
 * If the order is canceled, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = beginOrderExchangeValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 * })
 */
export const beginOrderExchangeValidationStep = createStep(
  "begin-exchange-order-validation",
  async function ({ order }: BeginOrderExchangeValidationStepInput) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginExchangeOrderWorkflowId = "begin-exchange-order"
/**
 * This workflow requests an order exchange. It's used by the
 * [Create Exchange Admin API Route](https://docs.medusajs.com/api/admin/exchanges/create-exchange).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to request an exchange
 * for an order in your custom flow.
 *
 * @example
 * const { result } = await beginExchangeOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *   }
 * })
 *
 * @summary
 *
 * Request an order exchange.
 */
export const beginExchangeOrderWorkflow = createWorkflow(
  beginExchangeOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginOrderExchangeWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    beginOrderExchangeValidationStep({ order })

    const created = createOrderExchangesStep([
      {
        order_id: input.order_id,
        metadata: input.metadata,
        created_by: input.created_by,
      },
    ])

    const orderChangeInput = transform(
      { created, input },
      ({ created, input }) => {
        return {
          change_type: "exchange" as const,
          order_id: input.order_id,
          exchange_id: created[0].id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
