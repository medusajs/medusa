import {
  FulfillmentDTO,
  OrderExchangeDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteReservationsByLineItemsStep } from "../../../reservation/steps/delete-reservations-by-line-items"
import { cancelOrderExchangeStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"
import { cancelReturnWorkflow } from "../return/cancel-return"

/**
 * This step validates that an exchange can be canceled.
 */
export const cancelExchangeValidateOrder = createStep(
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
      "All fulfillments must be canceled before canceling am exchange"
    )
  }
)

export const cancelOrderExchangeWorkflowId = "cancel-exchange"
/**
 * This workflow cancels a confirmed exchange.
 */
export const cancelOrderExchangeWorkflow = createWorkflow(
  cancelOrderExchangeWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CancelOrderExchangeWorkflowInput>
  ): WorkflowData<void> => {
    const orderExchange: OrderExchangeDTO & { fulfillments: FulfillmentDTO[] } =
      useRemoteQueryStep({
        entry_point: "order_exchange",
        fields: [
          "id",
          "order_id",
          "return_id",
          "canceled_at",
          "fulfillments.canceled_at",
          "additional_items.item_id",
        ],
        variables: { id: input.exchange_id },
        list: false,
        throw_if_key_not_found: true,
      })

    cancelExchangeValidateOrder({ orderExchange, input })

    const lineItemIds = transform({ orderExchange }, ({ orderExchange }) => {
      return orderExchange.additional_items?.map((i) => i.item_id)
    })

    parallelize(
      cancelOrderExchangeStep({
        exchange_id: orderExchange.id,
        order_id: orderExchange.order_id,
        canceled_by: input.canceled_by,
      }),
      deleteReservationsByLineItemsStep(lineItemIds)
    )

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
