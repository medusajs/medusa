import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderExchangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteOrderShippingMethods } from "../../steps"
import { deleteOrderChangeActionsStep } from "../../steps/delete-order-change-actions"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that a shipping method can be removed from an exchange.
 */
export type RemoveExchangeShippingMethodValidationStepInput = {
  /**
   * The order exchange's details.
   */
  orderExchange: OrderExchangeDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the action.
   */
  input: Pick<OrderWorkflow.DeleteExchangeShippingMethodWorkflowInput, "exchange_id" | "action_id">
}

/**
 * This step validates that a shipping method can be removed from an exchange.
 * If the exchange is canceled, the order change is not active, the shipping method
 * doesn't exist, or the action isn't adding a shipping method, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order exchange and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = removeExchangeShippingMethodValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderExchange: {
 *     id: "exchange_123",
 *     // other order exchange details...
 *   },
 *   input: {
 *     exchange_id: "exchange_123",
 *     action_id: "orchact_123",
 *   }
 * })
 */
export const removeExchangeShippingMethodValidationStep = createStep(
  "validate-remove-exchange-shipping-method",
  async function ({
    orderChange,
    orderExchange,
    input,
  }: RemoveExchangeShippingMethodValidationStepInput) {
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for exchange ${input.exchange_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const removeExchangeShippingMethodWorkflowId =
  "remove-exchange-shipping-method"
/**
 * This workflow removes an inbound or outbound shipping method of an exchange. It's used by the
 * [Remove Inbound Shipping Admin API Route](https://docs.medusajs.com/api/admin/exchanges/remove-inbound-shipping-method) or
 * the [Remove Outbound Shipping Admin API Route](https://docs.medusajs.com/api/admin/exchanges/remove-outbound-shipping-method).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove an inbound or outbound shipping method
 * from an exchange in your custom flow.
 * 
 * @example
 * const { result } = await removeExchangeShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     action_id: "orchact_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Remove an inbound or outbound shipping method from an exchange.
 */
export const removeExchangeShippingMethodWorkflow = createWorkflow(
  removeExchangeShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteExchangeShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeExchangeShippingMethodValidationStep({
      orderExchange,
      orderChange,
      input,
    })

    const dataToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        const associatedAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        return {
          actionId: associatedAction.id,
          shippingMethodId: associatedAction.reference_id,
        }
      }
    )

    parallelize(
      deleteOrderChangeActionsStep({ ids: [dataToRemove.actionId] }),
      deleteOrderShippingMethods({ ids: [dataToRemove.shippingMethodId] })
    )

    return new WorkflowResponse(previewOrderChangeStep(orderExchange.order_id))
  }
)
