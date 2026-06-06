import { CartWorkflowEvents, MedusaError } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AdditionalData } from "@medusajs/types"
import { emitEventStep } from "../../common/steps/emit-event"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { acquireLockStep, releaseLockStep } from "../../locking"
import {
  addShippingMethodToCartStep,
  removeShippingMethodFromCartStep,
  validateCartShippingOptionsStep,
} from "../steps"
import { validateCartStep } from "../steps/validate-cart"
import { validateAndReturnShippingMethodsDataStep } from "../steps/validate-shipping-methods-data"
import { validateCartShippingOptionsPriceStep } from "../steps/validate-shipping-options-price"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { listShippingOptionsForCartWithPricingWorkflow } from "./list-shipping-options-for-cart-with-pricing"
import { refreshCartItemsWorkflow } from "./refresh-cart-items"

/**
 * The data to add a shipping method to a cart.
 */
export interface AddShippingMethodToCartWorkflowInput {
  /**
   * The ID of the cart to add the shipping method to.
   */
  cart_id: string
  /**
   * The shipping options to create the shipping methods from and add to the cart.
   */
  options: {
    /**
     * The ID of the shipping option.
     */
    id: string
    /**
     * Custom data useful for the fulfillment provider processing the shipping option or method.
     *
     * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property).
     */
    data?: Record<string, unknown>
  }[]
}

export const addShippingMethodToCartWorkflowId = "add-shipping-method-to-cart"
/**
 * This workflow adds a shipping method to a cart. It's executed by the
 * [Add Shipping Method Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidshippingmethods).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to wrap custom logic around adding a shipping method to the cart.
 *
 * @example
 * const { result } = await addShippingMethodToCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     options: [
 *       {
 *         id: "so_123",
 *       },
 *       {
 *         id: "so_124",
 *         data: {
 *           carrier_code: "fedex",
 *         }
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add a shipping method to a cart.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 */
export const addShippingMethodToCartWorkflow = createWorkflow(
  addShippingMethodToCartWorkflowId,
  (
    input: WorkflowData<AddShippingMethodToCartWorkflowInput & AdditionalData>
  ) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validateCartStep({ cart })

    const validate = createHook("validate", {
      input,
      cart,
    })

    const optionIds = transform({ input }, (data) => {
      return (data.input.options ?? []).map((i) => i.id)
    })

    const shippingOptions =
      listShippingOptionsForCartWithPricingWorkflow.runAsStep({
        input: {
          options: input.options,
          cart_id: cart.id,
          is_return: false,
          additional_data: input.additional_data,
        },
      })

    validateCartShippingOptionsStep({
      option_ids: optionIds,
      prefetched_shipping_options: shippingOptions,
    })

    validateCartShippingOptionsPriceStep({ shippingOptions })

    const validateShippingMethodsDataInput = transform(
      { input, shippingOptions, cart },
      ({ input, shippingOptions, cart }) => {
        return input.options.map((inputOption) => {
          const shippingOption = shippingOptions.find(
            (so) => so.id === inputOption.id
          )

          return {
            id: inputOption.id,
            provider_id: shippingOption?.provider_id,
            option_data: shippingOption?.data ?? {},
            method_data: inputOption.data ?? {},
            context: {
              ...cart,
              from_location: shippingOption?.stock_location ?? {},
            },
          }
        })
      }
    )

    const validatedMethodData = validateAndReturnShippingMethodsDataStep(
      validateShippingMethodsDataInput
    )

    const shippingMethodInput = transform(
      {
        input,
        shippingOptions,
        validatedMethodData,
      },
      (data) => {
        const options = (data.input.options ?? []).map((option) => {
          const shippingOption = data.shippingOptions.find(
            (so) => so.id === option.id
          )!

          if (!shippingOption?.calculated_price) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Shipping option with ID ${shippingOption.id} do not have a price`
            )
          }

          const methodData = data.validatedMethodData?.find((methodData) => {
            return methodData?.[option.id]
          })

          return {
            shipping_option_id: shippingOption.id,
            amount: shippingOption.calculated_price.calculated_amount,
            is_tax_inclusive:
              !!shippingOption.calculated_price
                .is_calculated_price_tax_inclusive,
            data: methodData?.[option.id] ?? {},
            name: shippingOption.name,
            cart_id: data.input.cart_id,
          }
        })

        return options
      }
    )

    const currentCollidingShippingProfileMethodIds = transform(
      { input, shippingOptions, cart },
      ({ input, shippingOptions, cart }) => {
        const incomingProfileIds = new Set(
          input.options
            .map(
              (o) =>
                shippingOptions.find((so) => so.id === o.id)
                  ?.shipping_profile_id
            )
            .filter(Boolean)
        )

        return cart.shipping_methods
          .filter(
            (sm) =>
              !sm.shipping_option?.shipping_profile_id ||
              incomingProfileIds.has(sm.shipping_option.shipping_profile_id)
          )
          .map((sm) => sm.id)
      }
    )

    const [, createdShippingMethods] = parallelize(
      removeShippingMethodFromCartStep({
        shipping_method_ids: currentCollidingShippingProfileMethodIds,
      }),
      addShippingMethodToCartStep({
        shipping_methods: shippingMethodInput,
      })
    )

    refreshCartItemsWorkflow.runAsStep({
      input: {
        cart_id: cart.id,
        shipping_methods: createdShippingMethods,
        additional_data: input.additional_data,
      },
    })

    parallelize(
      emitEventStep({
        eventName: CartWorkflowEvents.UPDATED,
        data: { id: input.cart_id },
      }),
      releaseLockStep({
        key: cart.id,
      })
    )

    return new WorkflowResponse(void 0, {
      hooks: [validate],
    })
  }
)
