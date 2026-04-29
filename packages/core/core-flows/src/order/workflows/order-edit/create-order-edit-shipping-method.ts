import {
  AdditionalData,
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { pricingContextResult } from "../../../cart/utils/schemas"
import { useRemoteQueryStep } from "../../../common"
import { acquireLockStep, releaseLockStep } from "../../../locking"
import { previewOrderChangeStep } from "../../steps"
import { createOrderShippingMethods } from "../../steps/create-order-shipping-methods"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { prepareShippingMethod } from "../../utils/prepare-shipping-method"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { updateOrderTaxLinesWorkflow } from "../update-tax-lines"
import { getTranslatedShippingOptionsStep } from "../../../common/steps/get-translated-shipping-option"

/**
 * The data to validate that a shipping method can be created for an order edit.
 */
export type CreateOrderEditShippingMethodValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
}

/**
 * This step validates that a shipping method can be created for an order edit.
 * If the order is canceled or the order change is not active, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = createOrderEditShippingMethodValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   }
 * })
 */
export const createOrderEditShippingMethodValidationStep = createStep(
  "validate-create-order-edit-shipping-method",
  async function ({
    order,
    orderChange,
  }: CreateOrderEditShippingMethodValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

/**
 * The data to create a shipping method for an order edit.
 */
export type CreateOrderEditShippingMethodWorkflowInput = {
  /**
   * The ID of the order to create the shipping method for.
   */
  order_id: string
  /**
   * The ID of the shipping option to create the shipping method from.
   */
  shipping_option_id: string
  /**
   * The custom amount to create the shipping method with.
   * If not provided, the shipping option's amount is used.
   */
  custom_amount?: BigNumberInput | null
}

export const createOrderEditShippingMethodWorkflowId =
  "create-order-edit-shipping-method"
/**
 * This workflow creates a shipping method for an order edit. It's used by the
 * [Add Shipping Method API Route](https://docs.medusajs.com/api/admin#order-edits_postordereditsidshippingmethod).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to create a shipping method
 * for an order edit in your in your own custom flows.
 *
 * @example
 * const { result } = await createOrderEditShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     shipping_option_id: "so_123",
 *   }
 * })
 *
 * @summary
 *
 * Create a shipping method for an order edit.
 *
 * @property hooks.setPricingContext - This hook is executed before the shipping method is created. You can consume this hook to return any custom context useful for the prices retrieval of the shipping method's option.
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
 * import { createOrderEditShippingMethodWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * createOrderEditShippingMethodWorkflow.hooks.setPricingContext((
 *   { order, shipping_option_id, additional_data }, { container }
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
export const createOrderEditShippingMethodWorkflow = createWorkflow(
  createOrderEditShippingMethodWorkflowId,
  function (
    input: CreateOrderEditShippingMethodWorkflowInput & AdditionalData
  ) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code", "canceled_at", "locale"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        order,
        shipping_option_id: input.shipping_option_id,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )
    const setPricingContextResult = setPricingContext.getResult()

    const pricingContext = transform(
      { order, setPricingContextResult },
      (data) => {
        return {
          ...(data.setPricingContextResult ? data.setPricingContextResult : {}),
          currency_code: data.order.currency_code,
        }
      }
    )

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
          context: pricingContext,
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const translatedShippingOptions = getTranslatedShippingOptionsStep({
      shippingOptions: shippingOptions,
      locale: order.locale!,
    })

    const shippingMethodInput = transform(
      {
        relatedEntity: { order_id: order.id },
        shippingOptions: translatedShippingOptions,
        customPrice: input.custom_amount,
        orderChange,
        input,
      },
      prepareShippingMethod()
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
      },
    })

    const orderChangeActionInput = transform(
      {
        order,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_amount,
        orderChange,
      },
      ({
        shippingOptions,
        order,
        createdMethods,
        customPrice,
        orderChange,
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
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    const previewOrderChange = previewOrderChangeStep(
      order.id
    ) as OrderPreviewDTO

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChange, {
      hooks: [setPricingContext] as const,
    })
  }
)
