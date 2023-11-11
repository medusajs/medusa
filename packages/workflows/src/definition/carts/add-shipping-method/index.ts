import { createWorkflow, transform } from "../../../utils/composer"
import * as steps from "./TEMP-add-shipping-method/steps"
import {
  createMethodsDataTransformer,
  originalAndNewCartTransformer,
  prepareDeleteMethodsDataTransformer,
} from "./TEMP-add-shipping-method/transformers"

export const addShippingMethodToCartWorkflow = createWorkflow(
  "AddShippingMethod",
  async function (input) {
    /** Preparation */
    const preparedData = steps.prepareAddShippingMethodData(input)

    /** Validate ShippingOption for Cart */
    const validatedData = steps.validateShippingOptionDataStep(preparedData)

    /** Get ShippingOptionPrice */
    const price = steps.getShippingOptionPriceStep(preparedData, validatedData)

    /** Prepare data for creating ShippingMethods */
    const createMethodsData = transform(
      [preparedData, validatedData, price],
      createMethodsDataTransformer
    )

    /** Create ShippingMethods */
    const shippingMethods = await steps.createShippingMethodsStep(
      createMethodsData
    )

    /** Validate LineItem shipping */
    await steps.validateLineItemShippingStep(preparedData)

    /** Prepare data for deleting old unused ShippingMethods */
    const shippingMethodsToDelete = transform(
      [preparedData, shippingMethods],
      prepareDeleteMethodsDataTransformer
    )

    /** Delete ShippingMethods */
    await steps.deleteShippingMethodsStep(shippingMethodsToDelete)

    /** Retrieve updated Cart */
    let cart = await steps.retrieveCartStep(preparedData)

    /** Prepare data with new and original Cart */
    const adjustFreeShippingData = transform(
      [preparedData, cart],
      originalAndNewCartTransformer
    )

    /** Adjust shipping on Cart */
    await steps.adjustFreeShippingStep(adjustFreeShippingData)

    /** Retrieve updated Cart */
    cart = await steps.retrieveCartStep(preparedData)

    /** Prepare data with new and original Cart */
    const upsertPaymentSessionsData = transform(
      [preparedData, cart],
      originalAndNewCartTransformer
    )

    /** Upsert PaymentSessions */
    await steps.upsertPaymentSessionsStep(upsertPaymentSessionsData)
  }
)
