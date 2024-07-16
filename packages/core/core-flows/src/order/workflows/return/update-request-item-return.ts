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
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "update-request-item-return-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    input,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.UpdateRequestItemReturnWorkflowInput
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request return found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.RETURN_ITEM) {
      throw new Error(
        `Action ${associatedAction.id} is not requesting item return`
      )
    }
  }
)

export const updateRequestItemReturnWorkflowId = "update-request-item-return"
export const updateRequestItemReturnWorkflow = createWorkflow(
  updateRequestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateRequestItemReturnWorkflowInput>
  ): WorkflowData<OrderDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "items.*"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

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

    validationStep({ order, input, orderReturn, orderChange })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        return {
          id: input.action_id,
          details: {
            quantity: data.quantity ?? originalAction.details?.quantity,
          },
          internal_note: data.internal_note,
        }
      }
    )

    updateOrderChangeActionsStep([updateData])

    return previewOrderChangeStep(order.id)
  }
)
