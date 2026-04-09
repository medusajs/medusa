import {
  OrderChangeActionDTO,
  OrderChangeDTO,
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
import { useQueryGraphStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import { deleteOrderShippingMethods } from "../../steps"
import { deleteOrderChangeActionsStep } from "../../steps/delete-order-change-actions"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import { throwIfOrderChangeIsNotActive } from "../../utils/order-validation"

/**
 * The data to validate that a shipping method can be removed from an order edit.
 */
export type RemoveOrderEditShippingMethodValidationStepInput = {
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the shipping method to be removed.
   */
  input: Pick<
    OrderWorkflow.DeleteOrderEditShippingMethodWorkflowInput,
    "order_id" | "action_id"
  >
}

/**
 * This step validates that a shipping method can be removed from an order edit.
 * If the order change is not active, the shipping method isn't in the exchange,
 * or the action doesn't add a shipping method, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = removeOrderEditShippingMethodValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     action_id: "orchact_123",
 *   }
 * })
 */
export const removeOrderEditShippingMethodValidationStep = createStep(
  "validate-remove-order-edit-shipping-method",
  async function ({
    orderChange,
    input,
  }: RemoveOrderEditShippingMethodValidationStepInput) {
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for order ${input.order_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const removeOrderEditShippingMethodWorkflowId =
  "remove-order-edit-shipping-method"
/**
 * This workflow removes a shipping method of an order edit. It's used by the
 * [Remove Shipping Method Admin API Route](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsidshippingmethodaction_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove a
 * shipping method from an order edit in your custom flows.
 *
 * @example
 * const { result } = await removeOrderEditShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     action_id: "orchact_123",
 *   }
 * })
 *
 * @summary
 *
 * Remove a shipping method from an order edit.
 */
export const removeOrderEditShippingMethodWorkflow = createWorkflow(
  removeOrderEditShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderEditShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const orderChangeResult = useQueryGraphStep({
      entity: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
    }).config({ name: "order-change-query" })

    const orderChange = transform(
      { orderChangeResult },
      ({ orderChangeResult }) => {
        return orderChangeResult.data[0]
      }
    )

    removeOrderEditShippingMethodValidationStep({
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

    const previewOrderChange = previewOrderChangeStep(input.order_id) as OrderPreviewDTO

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChange)
  }
)
