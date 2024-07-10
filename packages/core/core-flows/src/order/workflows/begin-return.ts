import { OrderDTO, OrderWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeStep } from "../steps/create-order-change"
import { createReturnsStep } from "../steps/create-returns"
import { throwIfOrderIsCancelled } from "../utils/order-validation"

const validationStep = createStep(
  "begin-return-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginReturnOrderWorkflowId = "begin-return-order"
export const beginReturnOrderWorkflow = createWorkflow(
  beginReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.CreateOrderReturnWorkflowInput>
  ): WorkflowData<void> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "status",
        "region_id",
        "currency_code",
        "total",
        "item_total",
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validationStep({ order })

    const returnCreated = createReturnsStep([
      {
        order_id: input.order_id,
      },
    ])

    const orderChangeInput = transform(
      { returnCreated },
      ({ returnCreated }) => {
        return {
          order_id: input.order_id,
          return_id: returnCreated[0].id,
        }
      }
    )
    createOrderChangeStep(orderChangeInput)
  }
)
