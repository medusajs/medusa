import {
  AdditionalData,
  BigNumberInput,
  CalculatedRMAShippingContext,
  CalculateShippingOptionPriceDTO,
  ShippingOptionDTO,
} from "@medusajs/framework/types"
import {
  createHook,
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { BigNumber, ShippingOptionPriceType } from "@medusajs/framework/utils"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import { useQueryGraphStep, useRemoteQueryStep } from "../../common"
import { pricingContextResult } from "../../cart/utils/schemas"

const COMMON_OPTIONS_FIELDS = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "service_zone.fulfillment_set_id",
  "service_zone.fulfillment_set.type",
  "service_zone.fulfillment_set.location.*",
  "service_zone.fulfillment_set.location.address.*",
  "shipping_profile_id",
  "provider_id",
  "data",

  "type.id",
  "type.label",
  "type.description",
  "type.code",

  "provider.id",
  "provider.is_enabled",

  "rules.attribute",
  "rules.value",
  "rules.operator",
]

/**
 * The data to create a shipping method for an order edit.
 */
export type FetchShippingOptionForOrderWorkflowInput = AdditionalData & {
  /**
   * The ID of the shipping option to fetch.
   */
  shipping_option_id: string
  /**
   * The custom amount of the shipping option.
   * If not provided, the shipping option's amount is used.
   */
  custom_amount?: BigNumberInput | null
  /**
   * The currency code of the order.
   */
  currency_code: string
  /**
   * The ID of the order.
   */
  order_id: string
  /**
   * The context of the RMA flow, which can be useful for retrieving the shipping option's price.
   */
  context: CalculatedRMAShippingContext
}

/**
 * The output of the fetch shipping option for order workflow.
 */
export type FetchShippingOptionForOrderWorkflowOutput = ShippingOptionDTO & {
  /**
   * The shipping option's price.
   */
  calculated_price: {
    /**
     * The shipping option's price based on its type and provided context.
     */
    calculated_amount: BigNumber
    /**
     * Whether the amount includes taxes.
     */
    is_calculated_price_tax_inclusive: boolean
  }
}

export const fetchShippingOptionsForOrderWorkflowId = "fetch-shipping-option"
/**
 * This workflow fetches a shipping option for an order. It's used in Return Merchandise Authorization (RMA) flows. It's used
 * by other workflows, such as {@link createClaimShippingMethodWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around fetching
 * shipping options for an order.
 *
 * @example
 * const { result } = await fetchShippingOptionForOrderWorkflow(container)
 * .run({
 *   input: {
 *     shipping_option_id: "so_123",
 *     currency_code: "usd",
 *     order_id: "order_123",
 *     context: {
 *       return_id: "ret_123",
 *       return_items: [
 *         {
 *           id: "orli_123",
 *           quantity: 1,
 *         }
 *       ]
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Fetch a shipping option for an order.
 *
 * @property hooks.setPricingContext - This hook is executed before the shipping option is fetched. You can consume this hook to set the pricing context for the shipping option. This is useful when you have custom pricing rules that depend on the context of the order.
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
 * import { fetchShippingOptionForOrderWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * fetchShippingOptionForOrderWorkflow.hooks.setPricingContext((
 *   { shipping_option_id, currency_code, order_id, context, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 *
 * The shipping option's price will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 *
 * @privateRemarks
 * There can be 3 cases:
 * 1. The shipping option is a flat rate shipping option.
 *    In this case, pricing calculation context is not used.
 * 2. The shipping option is a calculated shipping option.
 *    In this case, calculate shipping price method from the provider is called.
 * 3. The shipping option is a custom shipping option. -- TODO
 *    In this case, we don't need to do caluclations above and just return the shipping option with the custom amount.
 */
export const fetchShippingOptionForOrderWorkflow = createWorkflow(
  fetchShippingOptionsForOrderWorkflowId,
  function (input: FetchShippingOptionForOrderWorkflowInput) {
    const { data: initialOption } = useQueryGraphStep({
      entity: "shipping_option",
      filters: { id: input.shipping_option_id },
      fields: ["id", "price_type"],
      options: { isList: false },
    }).config({ name: "shipping-option-query" })

    const isCalculatedPriceShippingOption = transform(
      initialOption,
      (option) => option.price_type === ShippingOptionPriceType.CALCULATED
    )

    const calculatedPriceShippingOption = when(
      "option-calculated",
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => isCalculatedPriceShippingOption
    ).then(() => {
      const { data: order } = useQueryGraphStep({
        entity: "order",
        filters: { id: input.order_id },
        fields: ["id", "shipping_address", "items.*", "items.variant.*"],
        options: { throwIfKeyNotFound: true, isList: false },
      }).config({ name: "order-query" })

      const { data: shippingOption } = useQueryGraphStep({
        entity: "shipping_option",
        filters: { id: input.shipping_option_id },
        fields: COMMON_OPTIONS_FIELDS,
        options: { isList: false },
      }).config({ name: "calculated-option" })

      const calculateShippingOptionsPricesData = transform(
        {
          shippingOption,
          order,
          input,
        },
        ({ shippingOption, order, input }) => {
          return [
            {
              id: shippingOption.id as string,
              optionData: shippingOption.data,
              context: {
                ...order,
                ...input.context,
                from_location:
                  shippingOption.service_zone.fulfillment_set.location,
              },
              // data: {}, // TODO: add data
              provider_id: shippingOption.provider_id,
            } as CalculateShippingOptionPriceDTO,
          ]
        }
      )

      const prices = calculateShippingOptionsPricesStep(
        calculateShippingOptionsPricesData
      )

      const shippingOptionsWithPrice = transform(
        {
          shippingOption,
          prices,
        },
        ({ shippingOption, prices }) => {
          return {
            id: shippingOption.id,
            name: shippingOption.name,
            calculated_price: prices[0],
          }
        }
      )

      return shippingOptionsWithPrice
    })

    const setPricingContext = createHook("setPricingContext", input, {
      resultValidator: pricingContextResult,
    })
    const setPricingContextResult = setPricingContext.getResult()
    const pricingContext = transform(
      { input, setPricingContextResult },
      (data) => {
        return {
          ...(data.setPricingContextResult ? data.setPricingContextResult : {}),
          currency_code: data.input.currency_code,
        }
      }
    )

    const flatRateShippingOption = when(
      "option-flat",
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => !isCalculatedPriceShippingOption
    ).then(() => {
      const shippingOption = useRemoteQueryStep({
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
        list: false,
      }).config({ name: "flat-reate-option" })

      return shippingOption
    })

    const result: FetchShippingOptionForOrderWorkflowOutput = transform(
      {
        calculatedPriceShippingOption,
        flatRateShippingOption,
      },
      ({ calculatedPriceShippingOption, flatRateShippingOption }) => {
        return calculatedPriceShippingOption ?? flatRateShippingOption
      }
    )

    return new WorkflowResponse(result, { hooks: [setPricingContext] as const })
  }
)
