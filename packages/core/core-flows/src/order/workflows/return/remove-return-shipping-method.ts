import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
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
import { deleteOrderShippingMethods } from "../../steps"
import { deleteOrderChangeActionsStep } from "../../steps/delete-order-change-actions"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "validate-remove-return-shipping-method",
  async function ({
    orderChange,
    orderReturn,
    input,
  }: {
    input: { return_id: string; action_id: string }
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
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
export const removeReturnShippingMethodWorkflow = createWorkflow(
  removeReturnShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteReturnShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderDTO> {
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

    validationStep({ orderReturn, orderChange, input })

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
