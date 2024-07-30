import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "remove-item-claim-action-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
    input,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No item claim found for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.WRITE_OFF_ITEM) {
      throw new Error(`Action ${associatedAction.id} is not claiming an item`)
    }
  }
)

export const removeItemClaimActionWorkflowId = "remove-item-claim-action"
export const removeItemClaimActionWorkflow = createWorkflow(
  removeItemClaimActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput>
  ): WorkflowResponse<WorkflowData<OrderDTO>> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, input, orderClaim, orderChange })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
