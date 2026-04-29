import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  ReturnDTO,
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
 * The data to validate that a shipping method can be created for a return.
 */
export type CreateReturnShippingMethodValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that a shipping method can be created for a return.
 * If the order or return is canceled, or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createReturnShippingMethodValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 * })
 */
export const createReturnShippingMethodValidationStep = createStep(
  "validate-create-return-shipping-method",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: CreateReturnShippingMethodValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to create a shipping method for a return.
 */
export type CreateReturnShippingMethodWorkflowInput = {
  /**
   * The ID of the return to create the shipping method for.
   */
  return_id: string
  /**
   * The ID of the claim associated with the return, if any.
   */
  claim_id?: string
  /**
   * The ID of the exchange associated with the return, if any.
   */
  exchange_id?: string
  /**
   * The ID of the shipping option to create the shipping method from.
   */
  shipping_option_id: string
  /**
   * The custom amount to charge for the shipping method.
   * If not provided, the amount from the shipping option will be used.
   */
  custom_amount?: BigNumberInput | null
}

export const createReturnShippingMethodWorkflowId =
  "create-return-shipping-method"
/**
 * This workflow creates a shipping method for a return. It's used by the
 * [Add Shipping Method Store API Route](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethod).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to create a shipping method for a return in your custom flows.
 *
 * @example
 * const { result } = await createReturnShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     shipping_option_id: "so_123",
 *   }
 * })
 *
 * @summary
 *
 * Create a shipping method for a return.
 */
export const createReturnShippingMethodWorkflow = createWorkflow(
  createReturnShippingMethodWorkflowId,
  function (
    input: CreateReturnShippingMethodWorkflowInput
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: [
        "id",
        "status",
        "order_id",
        "claim_id",
        "exchange_id",
        "canceled_at",
      ],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code", "canceled_at", "locale"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const shippingOptionFetchInput = transform(
      { orderChange, input, order, orderReturn },
      ({ orderChange, input, order, orderReturn }) => {
        return {
          order_id: order.id,
          shipping_option_id: input.shipping_option_id,
          currency_code: order.currency_code,
          context: {
            return_id: orderReturn.id,
            return_items: orderChange.actions
              .filter(
                (action) => action.action === ChangeActionType.RETURN_ITEM
              )
              .map((a) => ({
                id: a.details?.reference_id as string,
                quantity: a.details?.quantity as number,
              })),
          },
        }
      }
    )

    const shippingOption = fetchShippingOptionForOrderWorkflow.runAsStep({
      input: shippingOptionFetchInput,
    })

    const shippingOptions = transform(shippingOption, (shippingOption) => {
      return [shippingOption]
    })

    const translatedShippingOptions = getTranslatedShippingOptionsStep({
      shippingOptions: shippingOptions,
      locale: order.locale!,
    })

    createReturnShippingMethodValidationStep({
      order,
      orderReturn,
      orderChange,
    })

    const shippingMethodInput = transform(
      {
        relatedEntity: orderReturn,
        shippingOptions: translatedShippingOptions,
        customPrice: input.custom_amount,
        orderChange,
        input,
      },
      prepareShippingMethod("return_id")
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
        is_return: true,
      },
    })

    const orderChangeActionInput = transform(
      {
        order,
        orderReturn,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_amount,
        orderChange,
        input,
      },
      ({
        shippingOptions,
        orderReturn,
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
          return_id: orderReturn.id,
          claim_id: input.claim_id,
          exchange_id: input.exchange_id,
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
