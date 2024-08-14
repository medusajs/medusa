import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  updateOrderChangeActionsStep,
  updateOrderShippingMethodsStep,
} from "../../steps"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import { throwIfOrderChangeIsNotActive } from "../../utils/order-validation"

/**
 * This step validates that an order edit's shipping method can be updated.
 */
export const updateOrderEditShippingMethodValidationStep = createStep(
  "validate-update-order-edit-shipping-method",
  async function ({
    orderChange,
    input,
  }: {
    input: { order_id: string; action_id: string }
    orderChange: OrderChangeDTO
  }) {
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

export const updateOrderEditShippingMethodWorkflowId =
  "update-order-edit-shipping-method"
/**
 * This workflow updates an order edit's shipping method.
 */
export const updateOrderEditShippingMethodWorkflow = createWorkflow(
  updateOrderEditShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateOrderEditShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderDTO> {
    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    updateOrderEditShippingMethodValidationStep({
      orderChange,
      input,
    })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data

        const action = {
          id: originalAction.id,
          amount: data.custom_price,
          internal_note: data.internal_note,
        }

        const shippingMethod = {
          id: originalAction.reference_id,
          amount: data.custom_price,
          metadata: data.metadata,
        }

        return {
          action,
          shippingMethod,
        }
      }
    )

    parallelize(
      updateOrderChangeActionsStep([updateData.action]),
      updateOrderShippingMethodsStep([updateData.shippingMethod!])
    )

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
