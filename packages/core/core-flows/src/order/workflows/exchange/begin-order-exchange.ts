import { OrderChangeDTO, OrderDTO, OrderWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { createOrderExchangesStep } from "../../steps/exchange/create-exchange"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

const validationStep = createStep(
  "begin-exchange-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginExchangeOrderWorkflowId = "begin-exchange-order"
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

    validationStep({ order })

    const created = createOrderExchangesStep([
      {
        order_id: input.order_id,
        metadata: input.metadata,
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
