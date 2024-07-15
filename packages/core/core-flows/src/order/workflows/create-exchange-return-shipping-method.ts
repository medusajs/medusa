import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
} from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeActionsStep } from "../steps/create-order-change-actions"
import { createOrderShippingMethods } from "../steps/create-order-shipping-methods"
import {
  throwIfOrderChangeIsNotActive,
  throwIfOrderIsCancelled,
} from "../utils/order-validation"

const validationStep = createStep(
  "validate-create-exchange-return-shipping-method",
  async function ({
    order,
    orderChange,
  }: {
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfOrderIsCancelled({ order })
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const createExchangeReturnShippingMethodWorkflowId =
  "create-exchange-return-shipping-method"
export const createExchangeReturnShippingMethodWorkflow = createWorkflow(
  createExchangeReturnShippingMethodWorkflowId,
  function (input: {
    exchangeId: string
    shippingOptionId: string
    customShippingPrice?: BigNumberInput
  }): WorkflowData {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "return_id"],
      variables: { id: input.exchangeId },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: [
        "id",
        "name",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
      ],
      variables: {
        id: input.shippingOptionId,
        calculated_price: {
          context: { currency_code: order.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const shippingMethodInput = transform(
      { orderExchange, shippingOptions, input },
      (data) => {
        const option = data.shippingOptions[0]

        return {
          shipping_option_id: option.id,
          amount:
            data.input.customShippingPrice ??
            option.calculated_price.calculated_amount,
          is_tax_inclusive:
            !!option.calculated_price.is_calculated_price_tax_inclusive,
          data: option.data ?? {},
          name: option.name,
          order_id: data.orderExchange.order_id,
          return_id: data.orderExchange.return_id,
          exchange_id: data.orderExchange.id,
        }
      }
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: { order_id: orderExchange.order_id },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderChange })

    const orderChangeActionInput = transform(
      {
        orderId: order.id,
        returnId: orderExchange.return_id,
        exchangeId: orderExchange.id,
        shippingOption: shippingOptions[0],
        methodId: createdMethods[0].id,
        customPrice: input.customShippingPrice,
      },
      ({
        shippingOption,
        exchangeId,
        returnId,
        orderId,
        methodId,
        customPrice,
      }) => {
        const methodPrice =
          customPrice ?? shippingOption.calculated_price.calculated_amount

        return {
          action: ChangeActionType.SHIPPING_ADD,
          reference: "order_shipping_method",
          reference_id: methodId,
          amount: methodPrice,
          details: {
            order_id: orderId,
            return_id: returnId,
            exchange_id: exchangeId,
          },
        }
      }
    )

    return createOrderChangeActionsStep([orderChangeActionInput])
  }
)
