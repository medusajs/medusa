import { OrderWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"

import { ReturnDTO } from "@medusajs/types"
import { receiveReturnStep } from "../../steps/receive-return"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInReturn,
} from "../../utils/order-validation"

const validationStep = createStep(
  "receive-return-order-validation",
  async function (
    {
      orderReturn,
      input,
    }: {
      orderReturn
      input: OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput
    },
    context
  ) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfItemsDoesNotExistsInReturn({ orderReturn, inputItems: input.items })
  }
)

export const receiveAndCompleteReturnOrderWorkflowId = "receive-return-order"
export const receiveAndCompleteReturnOrderWorkflow = createWorkflow(
  receiveAndCompleteReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.ReceiveCompleteOrderReturnWorkflowInput>
  ): WorkflowData<ReturnDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "returns",
      fields: ["id", "canceled_at", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validationStep({ orderReturn, input })

    const received = receiveReturnStep(input)

    return received
  }
)
