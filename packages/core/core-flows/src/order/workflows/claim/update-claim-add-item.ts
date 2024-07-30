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
  "update-claim-add-item-validation",
  async function (
    {
      order,
      orderChange,
      orderClaim,
      input,
    }: {
      order: OrderDTO
      orderClaim: OrderClaimDTO
      orderChange: OrderChangeDTO
      input: OrderWorkflow.UpdateClaimAddNewItemWorkflowInput
    },
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request to add item for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

export const updateClaimAddItemWorkflowId = "update-claim-add-item"
export const updateClaimAddItemWorkflow = createWorkflow(
  updateClaimAddItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateClaimAddNewItemWorkflowInput>
  ): WorkflowResponse<OrderDTO> {
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

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
