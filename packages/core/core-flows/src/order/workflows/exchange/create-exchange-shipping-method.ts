import {
  BigNumberInput,
  CalculatedRMAShippingContext,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderPreviewDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import { createOrderShippingMethods } from "../../steps/create-order-shipping-methods"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { prepareShippingMethod } from "../../utils/prepare-shipping-method"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { updateOrderTaxLinesWorkflow } from "../update-tax-lines"
import { fetchShippingOptionForOrderWorkflow } from "../fetch-shipping-option"
import { getTranslatedShippingOptionsStep } from "../../../common/steps/get-translated-shipping-option"

/**
 * The data to validate that a shipping method can be created for an exchange.
 */
export type CreateExchangeShippingMethodValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order exchange's details.
   */
  orderExchange: OrderExchangeDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that an inbound or outbound shipping method can be created for an exchange.
 * If the order or exchange is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order exchange, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createExchangeShippingMethodValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderExchange: {
 *     id: "exchange_123",
 *     // other order exchange details...
 *   },
 * })
 */
export const createExchangeShippingMethodValidationStep = createStep(
  "validate-create-exchange-shipping-method",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: CreateExchangeShippingMethodValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The details to create the shipping method for the exchange.
 */
export type CreateExchangeShippingMethodWorkflowInput = {
  /**
   * The ID of the return associated with the exchange.
   * If set, an inbound shipping method will be created for the return.
   * If not set, an outbound shipping method will be created for the exchange.
   */
  return_id?: string
  /**
   * The ID of the exchange to create the shipping method for.
   */
  exchange_id?: string
  /**
   * The ID of the shipping option to create the shipping method from.
   */
  shipping_option_id: string
  /**
   * The custom amount to charge for the shipping method.
   * If not set, the shipping option's amount is used.
   */
  custom_amount?: BigNumberInput | null
}

export const createExchangeShippingMethodWorkflowId =
  "create-exchange-shipping-method"
/**
 * This workflow creates an inbound (return) or outbound (delivery of new items) shipping method for an exchange.
 * It's used by the [Add Inbound Shipping Admin API Route](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethod)
 * and the [Add Outbound Shipping Admin API Route](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutboundshippingmethod).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to create a shipping method
 * for an exchange in your custom flow.
 *
 * @example
 * To create an outbound shipping method for the exchange:
 *
 * ```ts
 * const { result } = await createExchangeShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     shipping_option_id: "so_123"
 *   }
 * })
 * ```
 *
 * To create an inbound shipping method, pass the ID of the return associated with the exchange:
 *
 * ```ts
 * const { result } = await createExchangeShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     exchange_id: "exchange_123",
 *     return_id: "return_123",
 *     shipping_option_id: "so_123"
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Create an inbound or outbound shipping method for an exchange.
 */
export const createExchangeShippingMethodWorkflow = createWorkflow(
  createExchangeShippingMethodWorkflowId,
  function (
    input: CreateExchangeShippingMethodWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code", "canceled_at", "locale"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const isReturn = transform(input, (data) => {
      return !!data.return_id
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const fetchShippingOptionInput = transform(
      { input, isReturn, orderChange, order },
      (data) => {
        const changeActionType = data.isReturn
          ? ChangeActionType.RETURN_ITEM
          : ChangeActionType.ITEM_ADD

        const items = data.orderChange.actions
          .filter((action) => action.action === changeActionType)
          .map((a) => ({
            id: a.details?.reference_id,
            quantity: a.details?.quantity,
          }))

        const context = data.isReturn
          ? {
              return_id: data.input.return_id,
              return_items: items,
            }
          : {
              exchange_id: data.input.exchange_id,
              exchange_items: items,
            }

        return {
          order_id: data.order.id,
          currency_code: data.order.currency_code,
          shipping_option_id: data.input.shipping_option_id,
          custom_amount: data.input.custom_amount,
          context: context as CalculatedRMAShippingContext,
        }
      }
    )

    const shippingOption = fetchShippingOptionForOrderWorkflow.runAsStep({
      input: fetchShippingOptionInput,
    })

    const shippingOptions = transform(shippingOption, (shippingOption) => {
      return [shippingOption]
    })

    const translatedShippingOptions = getTranslatedShippingOptionsStep({
      shippingOptions: shippingOptions,
      locale: order.locale!,
    })

    createExchangeShippingMethodValidationStep({
      order,
      orderExchange,
      orderChange,
    })

    const shippingMethodInput = transform(
      {
        relatedEntity: orderExchange,
        shippingOptions: translatedShippingOptions,
        customPrice: input.custom_amount,
        orderChange,
        input,
      },
      prepareShippingMethod("exchange_id")
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const shippingMethodIds = transform(createdMethods, (createdMethods) => {
      return createdMethods.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        shipping_method_ids: shippingMethodIds,
        is_return: isReturn,
      },
    })

    const orderChangeActionInput = transform(
      {
        order,
        orderExchange,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_amount,
        orderChange,
        input,
      },
      ({
        shippingOptions,
        orderExchange,
        order,
        createdMethods,
        customPrice,
        orderChange,
        input,
      }) => {
        const shippingOption = shippingOptions[0]
        const createdMethod = createdMethods[0]
        const methodPrice =
          customPrice ?? shippingOption.calculated_price.calculated_amount

        return {
          action: ChangeActionType.SHIPPING_ADD,
          reference: "order_shipping_method",
          order_change_id: orderChange.id,
          reference_id: createdMethod.id,
          amount: methodPrice,
          order_id: order.id,
          return_id: input.return_id,
          exchange_id: orderExchange.id,
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
