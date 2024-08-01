import {
  BigNumberInput,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import { createOrderChangeActionsStep } from "../../steps/create-order-change-actions"
import { createOrderShippingMethods } from "../../steps/create-order-shipping-methods"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "validate-create-claim-shipping-method",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const createClaimShippingMethodWorkflowId =
  "create-claim-shipping-method"
export const createClaimShippingMethodWorkflow = createWorkflow(
  createClaimShippingMethodWorkflowId,
  function (input: {
    return_id?: string
    claim_id?: string
    shipping_option_id: string
    custom_price?: BigNumberInput
  }): WorkflowResponse<OrderDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code", "canceled_at"],
      variables: { id: orderClaim.order_id },
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
        id: input.shipping_option_id,
        calculated_price: {
          context: { currency_code: order.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderClaim, orderChange })

    const shippingMethodInput = transform(
      {
        orderClaim,
        shippingOptions,
        customPrice: input.custom_price,
        orderChange,
        input,
      },
      (data) => {
        const option = data.shippingOptions[0]
        const orderChange = data.orderChange

        return {
          shipping_option_id: option.id,
          amount: data.customPrice ?? option.calculated_price.calculated_amount,
          is_tax_inclusive:
            !!option.calculated_price.is_calculated_price_tax_inclusive,
          data: option.data ?? {},
          name: option.name,
          version: orderChange.version,
          order_id: data.orderClaim.order_id,
          return_id: input.return_id,
          claim_id: data.orderClaim.id,
        }
      }
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const orderChangeActionInput = transform(
      {
        order,
        orderClaim,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_price,
        orderChange,
        input,
      },
      ({
        shippingOptions,
        orderClaim,
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
          claim_id: orderClaim.id,
        }
      }
    )

    createOrderChangeActionsStep([orderChangeActionInput])

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
