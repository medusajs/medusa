import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
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
 * The data to validate that a shipping method can be removed from a return.
 */
export type RemoveReturnShippingMethodValidationStepInput = {
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The details of the shipping method to be removed.
   */
  input: Pick<OrderWorkflow.DeleteReturnShippingMethodWorkflowInput, "return_id" | "action_id">
}

/**
 * This step validates that a shipping method can be removed from a return.
 * If the return is canceled, the order change is not active,
 * the shipping method isn't in the return,
 * or the action doesn't add a shipping method, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve a return and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = removeReturnShippingMethodValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 */
export const removeReturnShippingMethodValidationStep = createStep(
  "validate-remove-return-shipping-method",
  async function ({
    orderChange,
    orderReturn,
    input,
  }: RemoveReturnShippingMethodValidationStepInput) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const removeReturnShippingMethodWorkflowId =
  "remove-return-shipping-method"
/**
 * This workflow removes a shipping method from a return. It's used by the
 * [Remove Shipping Method from Return Admin API Route](https://docs.medusajs.com/api/admin/returns/remove-shipping-method).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to remove a shipping method from a return in your custom flows.
 * 
 * @example
 * const { result } = await removeReturnShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Remove a shipping method from a return.
 */
export const removeReturnShippingMethodWorkflow = createWorkflow(
  removeReturnShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteReturnShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeReturnShippingMethodValidationStep({
      orderReturn,
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

    return new WorkflowResponse(previewOrderChangeStep(orderReturn.order_id))
  }
)
