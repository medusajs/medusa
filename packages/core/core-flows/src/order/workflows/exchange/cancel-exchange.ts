import {
  FulfillmentDTO,
  OrderExchangeDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { cancelOrderExchangeStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"
import { cancelReturnWorkflow } from "../return/cancel-return"

const validateOrder = createStep(
  "validate-exchange",
  ({
    orderExchange,
  }: {
    orderExchange: OrderExchangeDTO
    input: OrderWorkflow.CancelOrderExchangeWorkflowInput
  }) => {
    const orderExchange_ = orderExchange as OrderExchangeDTO & {
      fulfillments: FulfillmentDTO[]
    }

    throwIfIsCancelled(orderExchange, "Exchange")

    const throwErrorIf = (
      arr: unknown[],
      pred: (obj: any) => boolean,
      message: string
    ) => {
      if (arr?.some(pred)) {
        throw new MedusaError(MedusaError.Types.NOT_ALLOWED, message)
      }
    }

    const notCanceled = (o) => !o.canceled_at

    throwErrorIf(
      orderExchange_.fulfillments,
      notCanceled,
      "All fulfillments must be canceled before canceling a exchange"
    )
  }
)

export const cancelOrderExchangeWorkflowId = "cancel-exchange"
export const cancelOrderExchangeWorkflow = createWorkflow(
  cancelOrderExchangeWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelOrderExchangeWorkflowInput>
  ): WorkflowData<void> => {
    const orderExchange: OrderExchangeDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "order_exchange",
        fields: ["id", "return_id", "canceled_at", "fulfillments.canceled_at"],
        variables: { id: input.exchange_id },
        list: false,
        throw_if_key_not_found: true,
      })

    validateOrder({ orderExchange, input })

    cancelOrderExchangeStep({ exchange_id: orderExchange.id })

    when({ orderExchange }, ({ orderExchange }) => {
      return !!orderExchange.return_id
    }).then(() => {
      cancelReturnWorkflow.runAsStep({
        input: {
          return_id: orderExchange.return_id!,
          no_notification: input.no_notification,
        },
      })
    })
  }
)
