import { ListShippingOptionsForCartWorkflowInputDTO } from "@medusajs/framework/types"
import { deepFlatMap, isPresent, MedusaError } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common/steps/use-remote-query"

export const listShippingOptionsForCartWorkflowId =
  "list-shipping-options-for-cart"
/**
 * This workflow lists the shipping options of a cart.
 */
export const listShippingOptionsForCartWorkflow = createWorkflow(
  listShippingOptionsForCartWorkflowId,
  (input: WorkflowData<ListShippingOptionsForCartWorkflowInputDTO>) => {
    const scLocationFulfillmentSets = useRemoteQueryStep({
      entry_point: "sales_channels",
      fields: ["stock_locations.fulfillment_sets.id"],
      variables: {
        id: input.sales_channel_id,
      },
    }).config({ name: "sales_channels-fulfillment-query" })

    const fulfillmentSetIds = transform(
      { options: scLocationFulfillmentSets },
      (data) => {
        const fulfillmentSetIds = new Set<string>()

        deepFlatMap(
          data.options,
          "stock_locations.fulfillment_sets",
          ({ fulfillment_sets }) => {
            if (fulfillment_sets?.id) {
              fulfillmentSetIds.add(fulfillment_sets.id)
            }
          }
        )

        return Array.from(fulfillmentSetIds)
      }
    )

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_options",
      fields: [
        "id",
        "name",
        "price_type",
        "service_zone_id",
        "shipping_profile_id",
        "provider_id",
        "data",
        "amount",

        "type.id",
        "type.label",
        "type.description",
        "type.code",

        "provider.id",
        "provider.is_enabled",

        "rules.attribute",
        "rules.value",
        "rules.operator",

        "calculated_price.*",
      ],
      variables: {
        context: {
          is_return: input.is_return,
          enabled_in_store: "true",
        },
        filters: {
          fulfillment_set_id: fulfillmentSetIds,
          address: {
            city: input.shipping_address?.city,
            country_code: input.shipping_address?.country_code,
            province_code: input.shipping_address?.province,
          },
        },

        calculated_price: {
          context: {
            currency_code: input.currency_code,
          },
        },
      },
    }).config({ name: "shipping-options-query" })

    const shippingOptionsWithPrice = transform(
      {
        shippingOptions,
      },
      (data) => {
        const optionsMissingPrices: string[] = []

        const options = data.shippingOptions.map((shippingOption) => {
          const { calculated_price, ...options } = shippingOption ?? {}

          if (options?.id && !isPresent(calculated_price?.calculated_amount)) {
            optionsMissingPrices.push(options.id)
          }

          return {
            ...options,
            amount: calculated_price?.calculated_amount,
            is_tax_inclusive:
              !!calculated_price?.is_calculated_price_tax_inclusive,
          }
        })

        if (optionsMissingPrices.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Shipping options with IDs ${optionsMissingPrices.join(
              ", "
            )} do not have a price`
          )
        }

        return options
      }
    )

    return new WorkflowResponse(shippingOptionsWithPrice)
  }
)
