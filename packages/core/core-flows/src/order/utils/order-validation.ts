import {
  OrderChangeDTO,
  OrderDTO,
  OrderLineItemDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  OrderStatus,
  arrayDifference,
  isPresent,
} from "@medusajs/framework/utils"

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

export function throwIfItemsAreNotGroupedByShippingRequirement({
  order,
  inputItems,
}: {
  order: Pick<OrderDTO, "id" | "items">
  inputItems: OrderWorkflow.CreateOrderFulfillmentWorkflowInput["items"]
}) {
  const itemsWithShipping: string[] = []
  const itemsWithoutShipping: string[] = []
  const orderItemsMap = new Map<string, OrderLineItemDTO>(
    (order.items || []).map((item) => [item.id, item])
  )

  for (const inputItem of inputItems) {
    const orderItem = orderItemsMap.get(inputItem.id)!

    if (orderItem.requires_shipping) {
      itemsWithShipping.push(orderItem.id)
    } else {
      itemsWithoutShipping.push(orderItem.id)
    }
  }

  if (itemsWithShipping.length && itemsWithoutShipping.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Fulfillment can only be created entirely with items with shipping or items without shipping. Split this request into 2 fulfillments.`
    )
  }
}

export function throwIfIsCancelled(
  obj: unknown & { id: string; canceled_at?: any },
  type: string
) {
  if (obj.canceled_at) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${type} with id ${obj.id} has been canceled.`
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
  const orderReturnItemIds = orderReturn.items?.map((i: any) => i.item_id) ?? []
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
