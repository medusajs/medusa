import {
  isDefined,
  QueryContext,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  AdditionalData,
  CalculateShippingOptionPriceDTO,
  ListShippingOptionsForCartWithPricingWorkflowInput,
  QueryContextType,
} from "@medusajs/framework/types"

import { useQueryGraphStep, validatePresenceOfStep } from "../../common"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"
import { calculateShippingOptionsPricesStep } from "../../fulfillment"
import { cartFieldsForCalculateShippingOptionsPrices } from "../utils/fields"
import { shippingOptionsContextResult } from "../utils/schemas"
import { getTranslatedShippingOptionsStep } from "../../common/steps/get-translated-shipping-option"

const COMMON_OPTIONS_FIELDS = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "service_zone.fulfillment_set_id",
  "service_zone.fulfillment_set.type",
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

export const listShippingOptionsForCartWithPricingWorkflowId =
  "list-shipping-options-for-cart-with-pricing"
/**
 * This workflow lists shipping options that can be used during checkout for a cart. It also retrieves the prices
 * of these shipping options, including calculated prices that may be retrieved from third-party providers.
 *
 * This workflow is executed in other cart-related workflows, such as {@link addShippingMethodToCartWorkflow} to retrieve the
 * price of the shipping method being added to the cart.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to retrieve the shipping options of a cart and their prices
 * in your custom flows.
 *
 * @example
 * const { result } = await listShippingOptionsForCartWithPricingWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     options: [
 *       {
 *         id: "so_123",
 *         data: {
 *           carrier_code: "fedex"
 *         }
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * List a cart's shipping options with prices.
 *
 * @property hooks.setShippingOptionsContext - This hook is executed after the cart is retrieved and before the shipping options are queried. You can consume this hook to return any custom context useful for the shipping options retrieval.
 *
 * For example, you can consume the hook to add the customer Id to the context:
 *
 * ```ts
 * import { listShippingOptionsForCartWithPricingWorkflow } from "@medusajs/medusa/core-flows"
 * import { StepResponse } from "@medusajs/workflows-sdk"
 *
 * listShippingOptionsForCartWithPricingWorkflow.hooks.setShippingOptionsContext(
 *   async ({ cart }, { container }) => {
 *
 *     if (cart.customer_id) {
 *       return new StepResponse({
 *         customer_id: cart.customer_id,
 *       })
 *     }
 *
 *     const query = container.resolve("query")
 *
 *     const { data: carts } = await query.graph({
 *       entity: "cart",
 *       filters: {
 *         id: cart.id,
 *       },
 *       fields: ["customer_id"],
 *     })
 *
 *     return new StepResponse({
 *       customer_id: carts[0].customer_id,
 *     })
 *   }
 * )
 * ```
 *
 * The `customer_id` property will be added to the context along with other properties such as `is_return` and `enabled_in_store`.
 *
 * :::note
 *
 * You should also consume the `setShippingOptionsContext` hook in the {@link listShippingOptionsForCartWorkflow} workflow to ensure that the context is consistent when listing shipping options across workflows.
 *
 * :::
 */
export const listShippingOptionsForCartWithPricingWorkflow = createWorkflow(
  listShippingOptionsForCartWithPricingWorkflowId,
  (
    input: WorkflowData<
      ListShippingOptionsForCartWithPricingWorkflowInput & AdditionalData
    >
  ) => {
    const optionIds = transform({ input }, ({ input }) =>
      (input.options ?? []).map(({ id }) => id)
    )

    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: [
        ...cartFieldsForCalculateShippingOptionsPrices,
        "sales_channel_id",
        "currency_code",
        "region_id",
        "item_total",
        "total",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart" })

    const cart = transform({ cartQuery }, ({ cartQuery }) => cartQuery.data[0])

    validatePresenceOfStep({
      entity: cart,
      fields: ["sales_channel_id", "region_id", "currency_code"],
    })

    const scFulfillmentSetQuery = useQueryGraphStep({
      entity: "sales_channels",
      filters: { id: cart.sales_channel_id },
      fields: [
        "stock_locations.id",
        "stock_locations.name",
        "stock_locations.address.*",
        "stock_locations.fulfillment_sets.id",
      ],
      options: {
        cache: {
          enable: true,
        },
      },
    }).config({ name: "sales_channels-fulfillment-query" })

    const scFulfillmentSets = transform(
      { scFulfillmentSetQuery },
      ({ scFulfillmentSetQuery }) => scFulfillmentSetQuery.data[0]
    )

    const { fulfillmentSetIds, fulfillmentSetLocationMap } = transform(
      { scFulfillmentSets },
      ({ scFulfillmentSets }) => {
        const fulfillmentSetIds = new Set<string>()
        const fulfillmentSetLocationMap = {}

        scFulfillmentSets.stock_locations.forEach((stockLocation) => {
          stockLocation.fulfillment_sets.forEach((fulfillmentSet) => {
            fulfillmentSetLocationMap[fulfillmentSet.id] = stockLocation
            fulfillmentSetIds.add(fulfillmentSet.id)
          })
        })

        return {
          fulfillmentSetIds: Array.from(fulfillmentSetIds),
          fulfillmentSetLocationMap,
        }
      }
    )

    const setShippingOptionsContext = createHook(
      "setShippingOptionsContext",
      {
        cart: cart,
        fulfillmentSetIds,
        additional_data: input.additional_data,
      },
      {
        resultValidator: shippingOptionsContextResult,
      }
    )
    const setShippingOptionsContextResult =
      setShippingOptionsContext.getResult()

    const commonOptions = transform(
      {
        input,
        cart,
        fulfillmentSetIds,
        optionIds,
        setShippingOptionsContextResult,
      },
      ({
        input,
        cart,
        fulfillmentSetIds,
        optionIds,
        setShippingOptionsContextResult,
      }) => ({
        context: QueryContext({
          ...(setShippingOptionsContextResult
            ? setShippingOptionsContextResult
            : {}),
          is_return: input.is_return ? "true" : "false",
          enabled_in_store: !isDefined(input.enabled_in_store)
            ? "true"
            : input.enabled_in_store
            ? "true"
            : "false",
        }),

        filters: {
          id: optionIds.length ? optionIds : undefined,
          fulfillment_set_id: fulfillmentSetIds,

          address: {
            country_code: cart.shipping_address?.country_code,
            province_code: cart.shipping_address?.province,
            city: cart.shipping_address?.city,
            postal_expression: cart.shipping_address?.postal_code,
          },
        },
      })
    )

    /**
     * We need to prefetch exact same SO as in the final result but only to determine pricing calculations first.
     */
    const { data: initialOptions } = useQueryGraphStep({
      entity: "shipping_options",
      fields: ["id", "price_type"],
      filters: commonOptions.filters,
      context: commonOptions.context as QueryContextType,
      options: {
        cache: {
          enable: true,
        },
      },
    }).config({ name: "shipping-options-price-type-query" })

    /**
     * Prepare queries for flat rate and calculated shipping options since price calculations are different for each.
     */
    const { flatRateOptionsQuery, calculatedShippingOptionsQuery } = transform(
      {
        cart,
        initialOptions: initialOptions,
        commonOptions,
      },
      ({ cart, initialOptions, commonOptions }) => {
        const flatRateShippingOptionIds: string[] = []
        const calculatedShippingOptionIds: string[] = []

        initialOptions.forEach((option) => {
          if (option.price_type === ShippingOptionPriceType.FLAT) {
            flatRateShippingOptionIds.push(option.id)
          } else {
            calculatedShippingOptionIds.push(option.id)
          }
        })

        return {
          flatRateOptionsQuery: {
            ...commonOptions,
            id: flatRateShippingOptionIds,
            calculated_price: { context: cart },
          },
          calculatedShippingOptionsQuery: {
            ...commonOptions,
            id: calculatedShippingOptionIds,
          },
        }
      }
    )

    const [shippingOptionsFlatRate, shippingOptionsCalculated] = parallelize(
      useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [
          ...COMMON_OPTIONS_FIELDS,
          "calculated_price.*",
          "prices.*",
          "prices.price_rules.*",
        ],
        variables: flatRateOptionsQuery,
      }).config({ name: "shipping-options-query-flat-rate" }),
      useRemoteQueryStep({
        entry_point: "shipping_options",
        fields: [...COMMON_OPTIONS_FIELDS],
        variables: calculatedShippingOptionsQuery,
      }).config({ name: "shipping-options-query-calculated" })
    )

    const calculateShippingOptionsPricesData = transform(
      {
        shippingOptionsCalculated,
        cart,
        input,
        fulfillmentSetLocationMap,
      },
      ({
        shippingOptionsCalculated,
        cart,
        input,
        fulfillmentSetLocationMap,
      }) => {
        const optionDataMap = new Map(
          (input.options ?? []).map(({ id, data }) => [id, data])
        )

        return shippingOptionsCalculated.map(
          (so) =>
            ({
              id: so.id as string,
              optionData: so.data,
              context: {
                ...cart,
                from_location:
                  fulfillmentSetLocationMap[so.service_zone.fulfillment_set_id],
              },
              data: optionDataMap.get(so.id),
              provider_id: so.provider_id,
            } as CalculateShippingOptionPriceDTO)
        )
      }
    )

    const prices = calculateShippingOptionsPricesStep(
      calculateShippingOptionsPricesData
    )

    const shippingOptionsWithPrice = transform(
      {
        shippingOptionsFlatRate,
        shippingOptionsCalculated,
        prices,
        fulfillmentSetLocationMap,
      },
      ({
        shippingOptionsFlatRate,
        shippingOptionsCalculated,
        prices,
        fulfillmentSetLocationMap,
      }) => {
        return [
          ...shippingOptionsFlatRate.map((shippingOption) => {
            const price = shippingOption.calculated_price

            return {
              ...shippingOption,
              amount: price?.calculated_amount,
              is_tax_inclusive: !!price?.is_calculated_price_tax_inclusive,
              stock_location:
                fulfillmentSetLocationMap[
                  shippingOption.service_zone.fulfillment_set_id
                ],
            }
          }),
          ...shippingOptionsCalculated.map((shippingOption, index) => {
            return {
              ...shippingOption,
              amount: prices[index]?.calculated_amount,
              is_tax_inclusive:
                prices[index]?.is_calculated_price_tax_inclusive,
              calculated_price: prices[index],
              stock_location:
                fulfillmentSetLocationMap[
                  shippingOption.service_zone.fulfillment_set_id
                ],
            }
          }),
        ]
      }
    )

    const translatedShippingOptions = getTranslatedShippingOptionsStep({
      shippingOptions: shippingOptionsWithPrice,
      locale: cart.locale,
    })

    return new WorkflowResponse(translatedShippingOptions as any[], {
      hooks: [setShippingOptionsContext] as const,
    })
  }
)
