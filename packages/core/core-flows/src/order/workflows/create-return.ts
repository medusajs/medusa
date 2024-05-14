import {
  CreateOrderShippingMethodDTO,
  OrderDTO,
  OrderWorkflow,
  ShippingOptionDTO,
} from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { arrayDifference, isDefined, MedusaError } from "@medusajs/utils"

function throwIfOrderIsCancelled(order: OrderDTO) {
  return transform({ order }, (data) => {
    // TODO find out how canceled at
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
  inputItems: OrderWorkflow.CreateOrderReturnWorkflowInput["items"]
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

function validateReturnReasons(
  order_id: string,
  inputItems: OrderWorkflow.CreateOrderReturnWorkflowInput["items"]
) {
  const reasonIds = inputItems.map((i) => i.reason_id).filter(Boolean)

  if (!reasonIds.length) {
    return
  }

  const returnReasons = useRemoteQueryStep({
    entry_point: "return_reasons",
    fields: ["*", "return_reason_children.*"],
    variables: { id: [inputItems.map((item) => item.reason_id)] },
  })

  return transform({ returnReasons }, (data) => {
    const reasons = data.returnReasons.map((r) => r.id)
    const hasUnusableReasons = reasons.filter(
      (reason) => reason.return_reason_children.length === 0
    )
    const hasUnExistingReasons = arrayDifference(reasonIds, reasons)

    if (hasUnExistingReasons.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Return reason with id ${hasUnExistingReasons.join(
          ", "
        )} does not exists.`
      )
    }

    if (hasUnusableReasons.length()) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot apply return reason category with id ${hasUnusableReasons.join(
          ", "
        )} to order with id ${order_id}.`
      )
    }
  })
}

function prepareShippingMethodData(
  orderId: string,
  inputShippingOption: OrderWorkflow.CreateOrderReturnWorkflowInput["return_shipping"],
  returnShippingOption: ShippingOptionDTO
) {
  return transform({ inputShippingOption, returnShippingOption }, (data) => {
    const obj: CreateOrderShippingMethodDTO = {
      name: returnShippingOption.name,
      order_id: orderId,
      shipping_option_id: returnShippingOption.id,
      amount:
        returnShippingOption.price_type === "flat_rate"
          ? returnShippingOption.amount
          : 0,
      // TODO
      data: {},
      tax_lines: [],
      adjustments: [],
    }

    if (
      isDefined(inputShippingOption.price) &&
      inputShippingOption.price >= 0
    ) {
      obj.price = inputShippingOption.price
    } else {
    }

    if (returnShippingOption.price_type === "calculated") {
      // TODO: retrieve calculated price and assign to amount
    }

    return obj
  })
}

function createReturnItems(
  order_id: string,
  items: OrderWorkflow.CreateOrderReturnWorkflowInput["items"]
) {
  return transform({ order_id, items }, (data) => {
    // create return line items
  })
}

export const createReturnsWorkflowId = "create-returns"
export const createReturnsWorkflow = createWorkflow(
  createReturnsWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CreateOrderReturnWorkflowInput>
  ): WorkflowData<OrderDTO> => {
    const order = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["*"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    throwIfOrderIsCancelled(order)
    throwIfItemsDoesNotExistsInOrder(order, input.items)
    validateReturnReasons(input.order_id, input.items)

    const returnShippingOption = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: ["*"],
      variables: {
        id: input.return_shipping.option_id,
      },
      list: false,
      throw_if_key_not_found: true,
    })

    const shippingMethodData = prepareShippingMethodData(
      input.order_id,
      input.return_shipping,
      returnShippingOption
    )

    // Create return line items

    // validate refundable amount if provided, otherwise compute it ourselves, check if it done by the order module service
    // create return actions
    // if option id then create shipping method, check that
    // create shipping tax lines
    // if option id then create fulfillment
  }
)
