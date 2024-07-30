import { OrderChangeDTO, OrderWorkflow, ReturnDTO } from "@medusajs/types"
import { OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { updateReturnsStep } from "../../steps"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "validate-update-return",
  async function ({
    orderChange,
    orderReturn,
  }: {
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const updateReturnWorkflowId = "update-return"
export const updateReturnWorkflow = createWorkflow(
  updateReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateReturnWorkflowInput>
  ): WorkflowResponse<WorkflowData> {
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

    validationStep({ orderReturn, orderChange })

    const updateData = transform({ input }, ({ input }) => {
      return {
        id: input.return_id,
        location_id: input.location_id,
        no_notification: input.no_notification,
        metadata: input.metadata,
      }
    })

    updateReturnsStep([updateData])

    return new WorkflowResponse(previewOrderChangeStep(orderReturn.order_id))
  }
)
