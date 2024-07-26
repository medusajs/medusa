import {
  BigNumberInput,
  CreateOrderShippingMethodDTO,
  FulfillmentWorkflow,
  OrderDTO,
  OrderWorkflow,
  ShippingOptionDTO,
  WithCalculatedPrice,
} from "@medusajs/types"
import { MathBN, MedusaError, Modules, isDefined } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../../common"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment"
import { createCompleteReturnStep } from "../../steps/create-complete-return"
import { receiveReturnStep } from "../../steps/receive-return"
import {
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderIsCancelled,
} from "../../utils/order-validation"
import { validateReturnReasons } from "../../utils/validate-return-reason"

function prepareShippingMethodData({
  orderId,
  inputShippingOption,
  returnShippingOption,
}: {
  orderId: string
  inputShippingOption?: OrderWorkflow.CreateOrderReturnWorkflowInput["return_shipping"]
  returnShippingOption: ShippingOptionDTO & WithCalculatedPrice
}) {
  if (!inputShippingOption) {
    return
  }

  const obj: CreateOrderShippingMethodDTO = {
    name: returnShippingOption.name,
    order_id: orderId,
    shipping_option_id: returnShippingOption.id,
    amount: 0,
    is_tax_inclusive: false,
    data: {},
    // Computed later in the flow
    tax_lines: [],
    adjustments: [],
  }

  if (
    isDefined(inputShippingOption.price) &&
    MathBN.gte(inputShippingOption.price, 0)
  ) {
    obj.amount = inputShippingOption.price
  } else {
    if (returnShippingOption.price_type === "calculated") {
      // TODO: retrieve calculated price and assign to amount
    } else {
      obj.amount = returnShippingOption.calculated_price.calculated_amount
      obj.is_tax_inclusive =
        !!returnShippingOption.calculated_price
          .is_calculated_price_tax_inclusive
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

function prepareReceiveItems({
  receiveNow,
  returnId,
  items,
  createdBy,
}: {
  receiveNow: boolean
  returnId: string
  items: {
    id: string
    quantity: BigNumberInput
  }[]
  createdBy?: string
}) {
  if (!receiveNow) {
    return {
      return_id: returnId,
      items: [],
    }
  }

  return {
    return_id: returnId,
    items: (items ?? []).map((i) => ({
      id: i.id,
      quantity: i.quantity,
    })),
    created_by: createdBy,
  }
}

function prepareFulfillmentData({
  order,
  input,
  returnShippingOption,
}: {
  order: OrderDTO
  input: OrderWorkflow.CreateOrderReturnWorkflowInput
  returnShippingOption: {
    id: string
    provider_id: string
    service_zone: { fulfillment_set: { location?: { id: string } } }
  }
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

  let locationId: string | undefined | null = input.location_id
  if (!locationId) {
    locationId = returnShippingOption.service_zone.fulfillment_set.location?.id
  }

  if (!locationId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot create return without stock location, either provide a location or you should link the shipping option ${returnShippingOption.id} to a stock location.`
    )
  }

  return {
    input: {
      location_id: locationId,
      provider_id: returnShippingOption.provider_id,
      shipping_option_id: input.return_shipping?.option_id,
      items: fulfillmentItems,
      labels: input.return_shipping?.labels ?? [],
      delivery_address: order.shipping_address ?? ({} as any), // TODO: should it be the stock location address?
      order: order,
    },
  }
}

function prepareReturnShippingOptionQueryVariables({
  order,
  input,
}: {
  order: {
    currency_code: string
    region_id?: string
  }
  input: {
    return_shipping?: OrderWorkflow.CreateOrderReturnWorkflowInput["return_shipping"]
  }
}) {
  const variables = {
    id: input.return_shipping?.option_id,
    calculated_price: {
      context: {
        currency_code: order.currency_code,
      },
    },
  }

  if (order.region_id) {
    variables.calculated_price.context["region_id"] = order.region_id
  }

  return variables
}

const validationStep = createStep(
  "create-return-order-validation",
  async function (
    {
      order,
      input,
    }: {
      order
      input: OrderWorkflow.CreateOrderReturnWorkflowInput
    },
    context
  ) {
    if (!input.items) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Items are required to create a return.`
      )
    }

    throwIfOrderIsCancelled({ order })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: input.items })
    await validateReturnReasons(
      { orderId: input.order_id, inputItems: input.items },
      context
    )
    validateCustomRefundAmount({ order, refundAmount: input.refund_amount })
  }
)

export const createAndCompleteReturnOrderWorkflowId =
  "create-complete-return-order"
export const createAndCompleteReturnOrderWorkflow = createWorkflow(
  createAndCompleteReturnOrderWorkflowId,
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
        "items.*",
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validationStep({ order, input })

    const returnShippingOptionsVariables = transform(
      { input, order },
      prepareReturnShippingOptionQueryVariables
    )

    const returnShippingOption = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: [
        "id",
        "price_type",
        "name",
        "provider_id",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
        "service_zone.fulfillment_set.location.id",
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

    const fulfillmentData = transform(
      { order, input, returnShippingOption },
      prepareFulfillmentData
    )

    const returnFulfillment =
      createReturnFulfillmentWorkflow.runAsStep(fulfillmentData)

    const returnCreated = createCompleteReturnStep({
      order_id: input.order_id,
      items: input.items,
      shipping_method: shippingMethodData,
      created_by: input.created_by,
    })

    const link = transform(
      { order_id: input.order_id, fulfillment: returnFulfillment },
      (data) => {
        return [
          {
            [Modules.ORDER]: { return_id: returnCreated.id },
            [Modules.FULFILLMENT]: { fulfillment_id: data.fulfillment.id },
          },
        ]
      }
    )

    createRemoteLinkStep(link)

    const receiveItems = transform(
      {
        receiveNow: input.receive_now ?? false,
        returnId: returnCreated.id,
        items: order.items!,
        createdBy: input.created_by!,
      },
      prepareReceiveItems
    )
    receiveReturnStep(receiveItems)
  }
)
