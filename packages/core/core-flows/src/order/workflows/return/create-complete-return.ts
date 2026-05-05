import {
  AdditionalData,
  BigNumberInput,
  CreateOrderShippingMethodDTO,
  FulfillmentWorkflow,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
  ShippingOptionDTO,
  WithCalculatedPrice,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  OrderWorkflowEvents,
  isDefined,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { pricingContextResult } from "../../../cart/utils/schemas"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../../common"
import { createReturnFulfillmentWorkflow } from "../../../fulfillment"
import { createCompleteReturnStep } from "../../steps/return/create-complete-return"
import { receiveReturnStep } from "../../steps/return/receive-return"
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
    service_zone: { fulfillment_set: { location?: { id: string , address?: Record<string, any> } } }
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

  // delivery address is set to the stock location address
  const { id: _id, ...address } = returnShippingOption.service_zone.fulfillment_set.location?.address ?? {}

  return {
    input: {
      location_id: locationId,
      provider_id: returnShippingOption.provider_id,
      shipping_option_id: input.return_shipping?.option_id,
      items: fulfillmentItems,
      labels: input.return_shipping?.labels ?? [],
      delivery_address: address,
      order: order,
    },
  }
}

function prepareReturnShippingOptionQueryVariables({
  order,
  input,
  setPricingContextResult,
}: {
  order: {
    currency_code: string
    region_id?: string
  }
  input: {
    return_shipping?: OrderWorkflow.CreateOrderReturnWorkflowInput["return_shipping"]
  }
  setPricingContextResult?: any
}) {
  const variables = {
    id: input.return_shipping?.option_id,
    calculated_price: {
      context: {
        ...(setPricingContextResult ? setPricingContextResult : {}),
        currency_code: order.currency_code,
      },
    },
  }

  if (order.region_id) {
    variables.calculated_price.context["region_id"] = order.region_id
  }

  return variables
}

/**
 * The data to validate that a return can be created and completed.
 */
export type CreateCompleteReturnValidationStepInput = {
  /**
   * The order's details.
   */
  order
  /**
   * The data to create a return.
   */
  input: OrderWorkflow.CreateOrderReturnWorkflowInput
}

/**
 * This step validates that a return can be created and completed for an order.
 * If the order is canceled, the items do not exist in the order,
 * the return reasons are invalid, or the refund amount is greater than the order total,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createCompleteReturnValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   input: {
 *     order_id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 */
export const createCompleteReturnValidationStep = createStep(
  "create-return-order-validation",
  async function (
    { order, input }: CreateCompleteReturnValidationStepInput,
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
/**
 * This workflow creates and completes a return from the storefront. The admin would receive the return and
 * process it from the dashboard. This workflow is used by the
 * [Create Return Store API Route](https://docs.medusajs.com/api/store#return_postreturn).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to create a return
 * for an order in your custom flow.
 *
 * @example
 * const { result } = await createAndCompleteReturnOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create and complete a return for an order.
 *
 * @property hooks.setPricingContext - This hook is executed before the return's shipping method is created. You can consume this hook to return any custom context useful for the prices retrieval of the shipping method's option.
 *
 * For example, assuming you have the following custom pricing rule:
 *
 * ```json
 * {
 *   "attribute": "location_id",
 *   "operator": "eq",
 *   "value": "sloc_123",
 * }
 * ```
 *
 * You can consume the `setPricingContext` hook to add the `location_id` context to the prices calculation:
 *
 * ```ts
 * import { createAndCompleteReturnOrderWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * createAndCompleteReturnOrderWorkflow.hooks.setPricingContext((
 *   { order, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 *
 * The price of the shipping method's option will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 */
export const createAndCompleteReturnOrderWorkflow = createWorkflow(
  createAndCompleteReturnOrderWorkflowId,
  function (
    input: WorkflowData<
      OrderWorkflow.CreateOrderReturnWorkflowInput & AdditionalData
    >
  ) {
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

    createCompleteReturnValidationStep({ order, input })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        order,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )
    const setPricingContextResult = setPricingContext.getResult()

    const returnShippingOptionsVariables = transform(
      { input, order, setPricingContextResult },
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
        "service_zone.fulfillment_set.location.address.*",
      ],
      variables: returnShippingOptionsVariables,
      list: false,
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
      location_id: input.location_id,
      items: input.items,
      shipping_method: shippingMethodData,
      created_by: input.created_by,
    })

    const link = transform(
      { returnCreated, fulfillment: returnFulfillment },
      (data) => {
        return [
          {
            [Modules.ORDER]: { return_id: data.returnCreated.id },
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

    parallelize(
      emitEventStep({
        eventName: OrderWorkflowEvents.RETURN_REQUESTED,
        data: {
          order_id: order.id,
          return_id: returnCreated.id,
        },
      }).config({ name: "emit-return-requested-event" }),
      emitEventStep({
        eventName: OrderWorkflowEvents.RETURN_RECEIVED,
        data: {
          order_id: order.id,
          return_id: returnCreated.id,
        },
      }).config({ name: "emit-return-received-event" })
    )

    return new WorkflowResponse(returnCreated as ReturnDTO, {
      hooks: [setPricingContext] as const,
    })
  }
)
