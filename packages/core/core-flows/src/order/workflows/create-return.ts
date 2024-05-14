import { CreateOrderReturnDTO, OrderDTO } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { arrayDifference, MedusaError } from "@medusajs/utils"

function throwIfOrderIsCancelled(order: OrderDTO) {
  return transform({ order }, (data) => {
    if (false /*order.cancelled_at*/) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Order with id ${order.id} has been cancelled.`
      )
    }
  })
}

function throwIfItemsDoesNotExistsInOrder(
  order: OrderDTO,
  inputItems: CreateOrderReturnDTO["items"]
) {
  return transform({ order, inputItems }, (data) => {
    const orderItemIds = data.order.items?.map((i) => i.id) ?? []
    const inputItemIds = data.inputItems.map((i) => i.item_id)
    const diff = arrayDifference(inputItemIds, orderItemIds)

    if (diff.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Items with ids ${diff.join(", ")} does not exist in order with id ${
          order.id
        }.`
      )
    }
  })
}

export const createReturnsWorkflowId = "create-returns"
export const createReturnsWorkflow = createWorkflow(
  createReturnsWorkflowId,
  (input: WorkflowData<CreateOrderReturnDTO>): WorkflowData<OrderDTO> => {
    const order = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["*"],
      variables: { id: input.order_id },
      list: false,
    })

    throwIfOrderIsCancelled(order)
    throwIfItemsDoesNotExistsInOrder(order, input.items)

    // Create return line items
    // validate refundable amount if provided, otherwise compute it ourselves, check if it done by the order module service
    // retrieve and validate return reasons from the items
    // create return actions
    // if option id then create shipping method, check that
    // create shipping tax lines
    // if option id then create fulfillment
  }
)
