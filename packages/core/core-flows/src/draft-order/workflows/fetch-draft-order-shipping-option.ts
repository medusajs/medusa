import {
  CalculatedShippingOptionPrice,
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
import {
  QueryContext,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import { useQueryGraphStep } from "../../common"
import { previewOrderChangeStep } from "../../order"
import { filterCartItemsByShippingProfile } from "../../cart/utils/filter-items-by-shipping-profile"
import {
  pricingContextResult,
  calculatedShippingPricingContextResult,
} from "../../cart/utils/schemas"
import {
  enrichPreviewLineItemsForShippingPriceCalculation,
  LINE_ITEM_FIELDS_FOR_SHIPPING_PRICE_CALCULATION,
  SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION,
} from "../utils/enrich-preview-line-items-for-shipping-price-calculation"

/**
 * The data to fetch a shipping option's price for a draft order.
 */
export interface FetchShippingOptionForDraftOrderWorkflowInput {
  /**
   * The ID of the shipping option to fetch.
   */
  shipping_option_id: string
  /**
   * The ID of the draft order.
   */
  order_id: string
  /**
   * The currency code of the draft order (used for flat-rate pricing).
   */
  currency_code: string
}

export type FetchShippingOptionForDraftOrderWorkflowOutput =
  ShippingOptionDTO & {
    calculated_price: CalculatedShippingOptionPrice
  }

export const fetchShippingOptionForDraftOrderWorkflowId =
  "fetch-shipping-option-for-draft-order"

/**
 * This workflow resolves a shipping option's price for a draft order edit.
 *
 * Unlike {@link fetchShippingOptionForOrderWorkflow}, the calculated-price
 * context is built from the draft order's **projected** state
 * (`previewOrderChange`), not its materialized items.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around fetching
 * shipping options for a draft order edit.
 *
 * @summary
 *
 * Fetch a shipping option for a draft order edit.
 *
 * @property hooks.setPricingContext - This hook is executed before the flat-rate
 * shipping option's price is retrieved. You can consume it to set the pricing
 * context for the shipping option, which is useful when you have custom pricing
 * rules that depend on the context of the order (e.g. a `location_id`). The
 * returned context is merged with the order's `currency_code`. Learn more in the
 * [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * @property hooks.setCalculatedShippingPricingContext - This hook is executed before a
 * calculated shipping option's price is calculated. You can consume it to return
 * any custom context that is merged into the `context` parameter of the
 * fulfillment provider's `calculatePrice` method (framework-provided properties
 * take precedence on a naming conflict).
 *
 * Unlike `setPricingContext`, which only affects flat-rate options priced by the
 * Pricing Module, this hook only affects calculated options.
 */
export const fetchShippingOptionForDraftOrderWorkflow = createWorkflow(
  fetchShippingOptionForDraftOrderWorkflowId,
  function (input: FetchShippingOptionForDraftOrderWorkflowInput) {
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

    const setCalculatedShippingPricingContext = createHook(
      "setCalculatedShippingPricingContext",
      { input },
      { resultValidator: calculatedShippingPricingContextResult }
    )
    const setCalculatedShippingPricingContextResult =
      setCalculatedShippingPricingContext.getResult()

    const calculatedPriceShippingOption = when(
      "option-calculated",
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => isCalculatedPriceShippingOption
    ).then(() => {
      const preview = previewOrderChangeStep(input.order_id)

      const { data: order } = useQueryGraphStep({
        entity: "order",
        filters: { id: input.order_id },
        fields: ["id", "shipping_address.*"],
        options: { isList: false },
      }).config({ name: "draft-order-query" })

      const projectedItemIds = transform(preview, (preview) =>
        (preview.items ?? []).map((item) => item.id)
      )

      const { data: lineItems } = useQueryGraphStep({
        entity: "order_line_item",
        filters: { id: projectedItemIds },
        fields: LINE_ITEM_FIELDS_FOR_SHIPPING_PRICE_CALCULATION,
      }).config({ name: "draft-order-line-items-query" })

      const { data: shippingOption } = useQueryGraphStep({
        entity: "shipping_option",
        filters: { id: input.shipping_option_id },
        fields: SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION,
        options: { isList: false },
      }).config({ name: "calculated-option" })

      const calculateShippingOptionsPricesData = transform(
        {
          shippingOption,
          order,
          preview,
          lineItems,
          setCalculatedShippingPricingContextResult,
        },
        ({
          shippingOption,
          order,
          preview,
          lineItems,
          setCalculatedShippingPricingContextResult,
        }) => {
          const items = enrichPreviewLineItemsForShippingPriceCalculation(
            preview.items,
            lineItems
          )

          return [
            {
              id: shippingOption.id as string,
              optionData: shippingOption.data,
              context: {
                ...setCalculatedShippingPricingContextResult,
                id: order.id,
                shipping_address: order.shipping_address,
                items: filterCartItemsByShippingProfile(
                  items,
                  shippingOption.shipping_profile_id
                ),
                from_location:
                  shippingOption.service_zone.fulfillment_set.location,
              },
              provider_id: shippingOption.provider_id,
            } as CalculateShippingOptionPriceDTO,
          ]
        }
      )

      const prices = calculateShippingOptionsPricesStep(
        calculateShippingOptionsPricesData
      )

      return transform(
        { shippingOption, prices },
        ({ shippingOption, prices }) => ({
          id: shippingOption.id,
          name: shippingOption.name,
          calculated_price: prices[0],
        })
      )
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
      const calculatedPriceQueryContext = transform(
        { pricingContext },
        ({ pricingContext }) => {
          return QueryContext(pricingContext)
        }
      )
      const { data: shippingOption } = useQueryGraphStep({
        entity: "shipping_option",
        fields: [
          "id",
          "name",
          "calculated_price.calculated_amount",
          "calculated_price.is_calculated_price_tax_inclusive",
        ],
        filters: {
          id: input.shipping_option_id,
        },
        context: {
          calculated_price: calculatedPriceQueryContext,
        },
        options: { isList: false },
      }).config({ name: "flat-rate-option" })

      return shippingOption
    })

    const result = transform(
      { calculatedPriceShippingOption, flatRateShippingOption },
      ({ calculatedPriceShippingOption, flatRateShippingOption }) =>
        calculatedPriceShippingOption ?? flatRateShippingOption
    )

    return new WorkflowResponse(result, {
      hooks: [setPricingContext, setCalculatedShippingPricingContext] as const,
    })
  }
)
