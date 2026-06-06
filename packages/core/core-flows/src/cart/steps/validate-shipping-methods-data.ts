import { Modules, promiseAll } from "@zjedene-medusa/framework/utils"
import {
  IFulfillmentModuleService,
  ValidateFulfillmentDataContext,
} from "@zjedene-medusa/framework/types"
import { createStep, StepResponse } from "@zjedene-medusa/workflows-sdk"

/**
 * The details of the shipping methods to validate.
 */
export type ValidateShippingMethodsDataInput = {
  /**
   * The shipping method's ID.
   */
  id: string
  /**
   * The fulfillment provider ID that associated with the shipping option
   * that the method was created from.
   */
  provider_id: string
  /**
   * The `data` property of the shipping option that the shipping method was
   * created from.
   */
  option_data: Record<string, unknown>
  /**
   * The `data` property of the shipping method.
   */
  method_data: Record<string, unknown>
  /**
   * The context to validate the shipping method.
   */
  context: ValidateFulfillmentDataContext
}[]

/**
 * The validated data of the shipping methods.
 */
export type ValidateShippingMethodsDataOutput =
  | void
  | {
      [x: string]: Record<string, unknown>
    }[]

export const validateAndReturnShippingMethodsDataStepId =
  "validate-and-return-shipping-methods-data"
/**
 * This step validates shipping options to ensure they can be applied on a cart.
 * The step either returns the validated data or void.
 *
 * @example
 * const data = validateAndReturnShippingMethodsDataStep({
 *   id: "sm_123",
 *   provider_id: "my_provider",
 *   option_data: {},
 *   method_data: {},
 *   context: {
 *     id: "cart_123",
 *     shipping_address: {
 *       id: "saddr_123",
 *       first_name: "Jane",
 *       last_name: "Smith",
 *       address_1: "456 Elm St",
 *       city: "Shelbyville",
 *       country_code: "us",
 *       postal_code: "67890",
 *     },
 *     items: [
 *       {
 *         variant: {
 *           id: "variant_123",
 *           weight: 1,
 *           length: 1,
 *           height: 1,
 *           width: 1,
 *           material: "wood",
 *           product: {
 *             id: "prod_123"
 *           }
 *         }
 *       }
 *     ],
 *     product: {
 *       id: "prod_123",
 *       collection_id: "pcol_123",
 *       categories: [],
 *       tags: []
 *     },
 *     from_location: {
 *       id: "sloc_123",
 *       first_name: "John",
 *       last_name: "Doe",
 *       address_1: "123 Main St",
 *       city: "Springfield",
 *       country_code: "us",
 *       postal_code: "12345",
 *     },
 *   }
 * })
 */
export const validateAndReturnShippingMethodsDataStep = createStep(
  validateAndReturnShippingMethodsDataStepId,
  async (data: ValidateShippingMethodsDataInput, { container }) => {
    const optionsToValidate = data ?? []

    if (!optionsToValidate.length) {
      return new StepResponse(void 0)
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const validatedData = await promiseAll(
      optionsToValidate.map(async (option) => {
        const validated = await fulfillmentModule.validateFulfillmentData(
          option.provider_id,
          option.option_data,
          option.method_data,
          option.context as ValidateFulfillmentDataContext
        )

        return {
          [option.id]: validated,
        }
      })
    )

    return new StepResponse(validatedData)
  }
)
