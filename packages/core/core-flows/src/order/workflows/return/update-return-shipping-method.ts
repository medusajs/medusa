import {
  AdditionalData,
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  updateOrderChangeActionsStep,
  updateOrderShippingMethodsStep,
} from "../../steps"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { prepareShippingMethodUpdate } from "../../utils/prepare-shipping-method"
import { pricingContextResult } from "../../../cart/utils/schemas"

/**
 * The data to validate that a return's shipping method can be updated.
 */
export type UpdateReturnShippingMethodValidationStepInput = {
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The details of updating the shipping method.
   */
  input: Pick<
    OrderWorkflow.UpdateReturnShippingMethodWorkflowInput,
    "return_id" | "action_id"
  >
}

/**
 * This step validates that a return's shipping method can be updated.
 * If the return is canceled, the order change is not active,
 * the shipping method isn't in the return, or the action isn't adding a shipping method,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve a return and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = updateReturnShippingMethodValidationStep({
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 */
export const updateReturnShippingMethodValidationStep = createStep(
  "validate-update-return-shipping-method",
  async function ({
    orderChange,
    orderReturn,
    input,
  }: UpdateReturnShippingMethodValidationStepInput) {
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const updateReturnShippingMethodWorkflowId =
  "update-return-shipping-method"
/**
 * This workflow updates the shipping method of a return. It's used by the
 * [Update Shipping Method Admin API Route](https://docs.medusajs.com/api/admin/returns/update-shipping-method).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to update the shipping method of a return in your custom flows.
 *
 * @example
 * const { result } = await updateReturnShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *     data: {
 *       custom_amount: 10,
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update the shipping method of a return.
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
 * import { updateReturnShippingMethodWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 * 
 * updateReturnShippingMethodWorkflow.hooks.setPricingContext((
 *   { order_return, order_change, additional_data }, { container }
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
export const updateReturnShippingMethodWorkflow = createWorkflow(
  updateReturnShippingMethodWorkflowId,
  function (
    input: WorkflowData<
      OrderWorkflow.UpdateReturnShippingMethodWorkflowInput & AdditionalData
    >
  ) {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: [
        "id",
        "status",
        "order_id",
        "canceled_at",
        "order.currency_code",
      ],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

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

    const setPricingContext = createHook(
      "setPricingContext",
      {
        order_return: orderReturn,
        order_change: orderChange,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )
    const setPricingContextResult = setPricingContext.getResult()

    const shippingOptions = when({ input }, ({ input }) => {
      return input.data?.custom_amount === null
    }).then(() => {
      const action = transform(
        { orderChange, input, orderReturn },
        ({ orderChange, input, orderReturn }) => {
          const originalAction = (orderChange.actions ?? []).find(
            (a) => a.id === input.action_id
          ) as OrderChangeActionDTO

          return {
            shipping_method_id: originalAction.reference_id,
            currency_code: (orderReturn as any).order.currency_code,
          }
        }
      )

      const pricingContext = transform(
        { action, setPricingContextResult },
        (data) => {
          return {
            ...(data.setPricingContextResult
              ? data.setPricingContextResult
              : {}),
            currency_code: data.action.currency_code,
          }
        }
      )

      const shippingMethod = useRemoteQueryStep({
        entry_point: "order_shipping_method",
        fields: ["id", "shipping_option_id"],
        variables: {
          id: action.shipping_method_id,
        },
        list: false,
      }).config({ name: "fetch-shipping-method" })

      return useRemoteQueryStep({
        entry_point: "shipping_option",
        fields: [
          "id",
          "name",
          "calculated_price.calculated_amount",
          "calculated_price.is_calculated_price_tax_inclusive",
        ],
        variables: {
          id: shippingMethod.shipping_option_id,
          calculated_price: {
            context: pricingContext,
          },
        },
      }).config({ name: "fetch-shipping-option" })
    })

    updateReturnShippingMethodValidationStep({
      orderReturn,
      orderChange,
      input,
    })

    const updateData = transform(
      { orderChange, input, shippingOptions },
      prepareShippingMethodUpdate
    )

    parallelize(
      updateOrderChangeActionsStep([updateData.action]),
      updateOrderShippingMethodsStep([updateData.shippingMethod!])
    )

    return new WorkflowResponse(
      previewOrderChangeStep(orderReturn.order_id) as OrderPreviewDTO,
      {
        hooks: [setPricingContext] as const,
      }
    )
  }
)
