import { CartDTO, ShippingMethodDTO } from "@medusajs/types"
import { createWorkflow, transform } from "../../../utils/composer"
import * as steps from "./TEMP-add-shipping-method/steps"
import {
  getCart,
  getShippingMethodConfig,
  getShippingOption,
} from "./TEMP-add-shipping-method/transformers"

type WorkflowInput = {
  cart_id: string
  option_id: string
  data: Record<string, unknown>
}

type WorkflowOutput = {
  cart: CartDTO
}

export const addShippingMethodToCartWorkflow = createWorkflow<
  WorkflowInput,
  WorkflowOutput,
  any
>("AddShippingMethod", function (input) {
  /** Get Cart */
  const cart = transform(input, getCart)

  /** Get ShippingMethod config */
  const shippingMethodConfig = transform(cart, getShippingMethodConfig)

  /** Get ShippingOption */
  const shippingOption = transform(input, getShippingOption)

  /** Validate ShippingOption for Cart */
  const validatedData = steps.validateShippingOptionForCartStep({
    shippingOption,
    cart,
    shippingMethodData: input.data,
  })

  /** Get ShippingOptionPrice */
  const price = steps.getShippingOptionPriceStep({
    shippingOption,
    shippingMethodData: validatedData,
    shippingMethodConfig: shippingMethodConfig,
  })

  const shippingMethodsToCreate = transform(
    { shippingOption, validatedData, shippingMethodConfig, price },
    (input) => {
      return {
        option: input.shippingOption,
        data: input.validatedData,
        config: input.shippingMethodConfig,
        price: input.price,
      }
    }
  )

  /** Create ShippingMethods */
  const createdShippingMethodsData = steps.createShippingMethodsStep({
    shippingMethods: shippingMethodsToCreate,
  })

  // /** Validate LineItem shipping */
  steps.validateLineItemShippingStep({ cart })

  /** Prepare data for deleting old unused ShippingMethods */
  const shippingMethodsToDelete = transform(
    { cart, shippingMethods: createdShippingMethodsData.shippingMethods },
    (input): ShippingMethodDTO[] => {
      const { cart, shippingMethods } = input

      if (!cart.shipping_methods?.length) {
        return []
      }

      const toDelete: any[] = []

      for (const method of cart.shipping_methods) {
        if (
          shippingMethods.some(
            (m) =>
              m.shipping_option.profile_id === method.shipping_option.profile_id
          )
        ) {
          toDelete.push(method)
        }
      }

      return toDelete
    }
  )

  /** Delete ShippingMethods */
  steps.deleteShippingMethodsStep(shippingMethodsToDelete)

  /** Retrieve updated Cart */
  const freshCart = transform(input, getCart)

  /** Adjust shipping on Cart */
  steps.adjustFreeShippingStep({ cart: freshCart, originalCart: cart })

  /** Retrieve updated Cart */
  const anotherFreshCart = transform(input, getCart)

  /** Upsert PaymentSessions */
  steps.upsertPaymentSessionsStep({
    cart: anotherFreshCart,
    originalCart: cart,
  })

  // TODO: Fix when return type has been fixed
  return transform({ cart }, (input) => ({ cart: input.cart }))
})
