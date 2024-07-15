import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeActionsStep } from "../steps/create-order-change-actions"
import { createOrderShippingMethods } from "../steps/create-order-shipping-methods"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../utils/order-validation"

const validationStep = createStep(
  "validate-create-return-shipping-method",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const createReturnShippingMethodWorkflowId =
  "create-return-shipping-method"
export const createReturnShippingMethodWorkflow = createWorkflow(
  createReturnShippingMethodWorkflowId,
  function (input: {
    returnId: string
    shippingOptionId: string
    customShippingPrice?: BigNumberInput
  }): WorkflowData {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id"],
      variables: { id: input.returnId },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code"],
      variables: { id: orderReturn.order_id },
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
      { orderReturn, shippingOptions },
      (data) => {
        const option = data.shippingOptions[0]

        return {
          shipping_option_id: option.id,
          amount: option.calculated_price.calculated_amount,
          is_tax_inclusive:
            !!option.calculated_price.is_calculated_price_tax_inclusive,
          data: option.data ?? {},
          name: option.name,
          order_id: data.orderReturn.order_id,
          return_id: data.orderReturn.id,
        }
      }
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: { order_id: orderReturn.order_id },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderReturn, orderChange })

    const orderChangeActionInput = transform(
      {
        orderId: order.id,
        returnId: orderReturn.id,
        shippingOption: shippingOptions[0],
        methodId: createdMethods[0].id,
        customPrice: input.customShippingPrice,
      },
      ({ shippingOption, returnId, orderId, methodId, customPrice }) => {
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
          },
        }
      }
    )

    return createOrderChangeActionsStep([orderChangeActionInput])
  }
)
