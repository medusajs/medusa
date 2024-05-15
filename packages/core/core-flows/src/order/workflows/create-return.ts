import {
  CreateOrderShippingMethodDTO,
  FulfillmentWorkflow,
  OrderDTO,
  OrderWorkflow,
  ShippingOptionDTO,
} from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../common"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  isDefined,
  MathBN,
  MedusaError,
  Modules,
} from "@medusajs/utils"
import { updateOrderTaxLinesStep } from "../steps"
import { createReturnStep } from "../steps/create-return"
import { createFulfillmentWorkflow } from "../../fulfillment"

function throwIfOrderIsCancelled({ order }: { order: OrderDTO }) {
  // TODO: need work, check cancelled
  if (false /*order.cancelled_at*/) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order with id ${order.id} has been cancelled.`
    )
  }
}

function throwIfItemsDoesNotExistsInOrder({
  order,
  inputItems,
}: {
  order: Pick<OrderDTO, "id" | "items">
  inputItems: OrderWorkflow.CreateOrderReturnWorkflowInput["items"]
}) {
  const orderItemIds = order.items?.map((i) => i.id) ?? []
  const inputItemIds = inputItems.map((i) => i.id)
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

function validateReturnReasons(
  {
    order_id,
    inputItems,
  }: {
    order_id: string
    inputItems: OrderWorkflow.CreateOrderReturnWorkflowInput["items"]
  },
  { container }
) {
  const reasonIds = inputItems.map((i) => i.reason_id).filter(Boolean)

  if (!reasonIds.length) {
    return
  }

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const returnReasons = remoteQuery({
    entry_point: "return_reasons",
    fields: ["return_reason_children.*"],
    variables: { id: [inputItems.map((item) => item.reason_id)] },
  })

  const reasons = returnReasons.map((r) => r.id)
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
}

function prepareShippingMethodData({
  orderId,
  inputShippingOption,
  returnShippingOption,
}: {
  orderId: string
  inputShippingOption: OrderWorkflow.CreateOrderReturnWorkflowInput["return_shipping"]
  returnShippingOption: ShippingOptionDTO & {
    calculated_price: { calculated_amount: number }
  }
}) {
  const obj: CreateOrderShippingMethodDTO = {
    name: returnShippingOption.name,
    order_id: orderId,
    shipping_option_id: returnShippingOption.id,
    amount: 0,
    data: {},
    // Computed later in the flow
    tax_lines: [],
    adjustments: [],
  }

  if (isDefined(inputShippingOption.price) && inputShippingOption.price >= 0) {
    obj.amount = inputShippingOption.price
  } else {
    if (returnShippingOption.price_type === "calculated") {
      // TODO: retrieve calculated price and assign to amount
    } else {
      obj.amount = returnShippingOption.calculated_price.calculated_amount
    }
  }

  return obj
}

function validateCustomRefundAmount({
  order,
  refundAmount,
}: {
  order: Pick<OrderDTO, "item_total">
  refundAmount?: number
}) {
  // validate that the refund prop input is less than order.item_total (item total)
  // TODO: Probably this amount should be retrieved from the payments linked to the order
  if (refundAmount && MathBN.gt(refundAmount, order.item_total)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Refund amount cannot be greater than order total.`
    )
  }
}

function prepareFulfillmentData({
  order,
  input,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderReturnWorkflowInput
}) {
  const inputItems = input.items
  const orderItemsMap = new Map<string, Required<OrderDTO>["items"][0]>(
    order.items!.map((i) => [i.id, i])
  )
  const fulfillmentItems = inputItems.map((i) => {
    const orderItem = orderItemsMap.get(i.id)!
    return {
      line_item_id: i.id,
      quantity: i.quantity,
      return_quantity: i.quantity,
      title: orderItem.variant_title ?? orderItem.title,
      sku: orderItem.variant_sku || "",
      barcode: orderItem.variant_barcode || "",
    } as FulfillmentWorkflow.CreateFulfillmentItemWorkflowDTO
  })

  return {
    input: {
      location_id: input.location_id,
      provider_id: input.provider_id,
      shipping_option_id: input.return_shipping.option_id,
      items: fulfillmentItems,
      labels: [] as FulfillmentWorkflow.CreateFulfillmentLabelWorkflowDTO[],
      delivery_address: order.shipping_address ?? ({} as any), // TODO: use the location address instead
      order: {} as FulfillmentWorkflow.CreateFulfillmentOrderWorkflowDTO, // TODO see what todo here, is that even necessary?
    },
  }
}

export const createReturnOrderWorkflowId = "create-return-order"
export const createReturnOrderWorkflow = createWorkflow(
  createReturnOrderWorkflowId,
  (
    input: WorkflowData<OrderWorkflow.CreateOrderReturnWorkflowInput>
  ): WorkflowData<OrderDTO> => {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "currency_code", "item_total", "items.*"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    transform({ order }, throwIfOrderIsCancelled)
    transform(
      { order, inputItems: input.items },
      throwIfItemsDoesNotExistsInOrder
    )
    transform(
      { order_id: input.order_id, inputItems: input.items },
      validateReturnReasons
    )
    transform(
      { order, refundAmount: input.refund_amount },
      validateCustomRefundAmount
    )

    const returnShippingOptionsVariables = transform(
      { input, order },
      (data) => {
        const variables = {
          id: data.input.return_shipping.option_id,
          calculated_price: {
            context: {
              currency_code: data.order.currency_code,
            },
          },
        }

        if (data.input.region) {
          variables.calculated_price.context["region_id"] = data.input.region.id
        }

        return variables
      }
    )

    const returnShippingOption = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: [
        "id",
        "price_type",
        "name",
        "calculated_price.calculated_amount",
      ],
      variables: returnShippingOptionsVariables,
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "return-shipping-option" })

    const shippingMethodData = transform(
      {
        orderId: input.order_id,
        inputShippingOption: input.return_shipping,
        returnShippingOption,
      },
      prepareShippingMethodData
    )

    createReturnStep({
      order_id: input.order_id,
      items: input.items,
      shipping_method: shippingMethodData,
      created_by: input.created_by,
    })

    updateOrderTaxLinesStep({
      order_id: input.order_id,
      shipping_methods: [shippingMethodData as any], // The types does not seems correct in that step and expect too many things compared to the actual needs
    })

    const fulfillmentData = transform({ order, input }, prepareFulfillmentData)

    const fulfillment = createFulfillmentWorkflow.runAsStep(fulfillmentData)

    // TODO call the createReturn from the fulfillment provider

    createRemoteLinkStep({
      [Modules.ORDER]: { order_id: input.order_id },
      [Modules.FULFILLMENT]: { fulfillment_id: fulfillment.id },
    })

    const freshOrder = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["*"],
      variables: { id: input.order_id },
      list: false,
    }).config({ name: "fresh-order" })

    return freshOrder
  }
)
