import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/types"
import {
  MedusaError,
  OrderStatus,
  arrayDifference,
  isPresent,
} from "@medusajs/utils"

export function throwIfOrderIsCancelled({ order }: { order: OrderDTO }) {
  if (order.status === OrderStatus.CANCELED) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order with id ${order.id} has been canceled.`
    )
  }
}

export function throwIfItemsDoesNotExistsInOrder({
  order,
  inputItems,
}: {
  order: Pick<OrderDTO, "id" | "items">
  inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
}) {
  const orderItemIds = order.items?.map((i) => i.id) ?? []
  const inputItemIds = inputItems?.map((i) => i.id)
  const diff = arrayDifference(inputItemIds, orderItemIds)

  if (diff.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Items with ids ${diff.join(", ")} does not exist in order with id ${
        order.id
      }.`
    )
  }
}

export function throwIfReturnIsCancelled({
  orderReturn,
}: {
  orderReturn: ReturnDTO
}) {
  if (orderReturn.canceled_at) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `return with id ${orderReturn.id} has been canceled.`
    )
  }
}

export function throwIfOrderChangeIsNotActive({
  orderChange,
}: {
  orderChange: OrderChangeDTO
}) {
  if (!isPresent(orderChange)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `An active Order Change is required to proceed`
    )
  }

  if (
    orderChange.canceled_at ||
    orderChange.confirmed_at ||
    orderChange.declined_at
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order change ${orderChange?.id} is not active to be modified`
    )
  }
}

export function throwIfItemsDoesNotExistsInReturn({
  orderReturn,
  inputItems,
}: {
  orderReturn: Pick<ReturnDTO, "id" | "items">
  inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
}) {
  const orderReturnItemIds = orderReturn.items?.map((i) => i.id) ?? []
  const inputItemIds = inputItems.map((i) => i.id)
  const diff = arrayDifference(inputItemIds, orderReturnItemIds)

  if (diff.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Items with ids ${diff.join(", ")} does not exist in Return with id ${
        orderReturn.id
      }.`
    )
  }
}
