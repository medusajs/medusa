import { ListShippingOptionsForCartWorkflowInputDTO } from "@medusajs/types"
import { deepFlatMap, MedusaError } from "@medusajs/utils"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"

export const listShippingOptionsForCartWorkflowId =
  "list-shipping-options-for-cart"
export const listShippingOptionsForCartWorkflow = createWorkflow(
  listShippingOptionsForCartWorkflowId,
  (input: WorkflowData<ListShippingOptionsForCartWorkflowInputDTO>) => {
    const scLocationFulfillmentSets = useRemoteQueryStep({
      entry_point: "sales_channels",
      fields: [
        "stock_locations.fulfillment_sets.id",
        "stock_locations.fulfillment_sets.name",
        "stock_locations.fulfillment_sets.price_type",
        "stock_locations.fulfillment_sets.service_zone_id",
        "stock_locations.fulfillment_sets.shipping_profile_id",
        "stock_locations.fulfillment_sets.provider_id",
        "stock_locations.fulfillment_sets.data",
        "stock_locations.fulfillment_sets.amount",

        "stock_locations.fulfillment_sets.service_zones.shipping_options.id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.name",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.price_type",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.service_zone_id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.shipping_profile_id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.provider_id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.data",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.amount",

        "stock_locations.fulfillment_sets.service_zones.shipping_options.type.id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.type.label",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.type.description",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.type.code",

        "stock_locations.fulfillment_sets.service_zones.shipping_options.provider.id",
        "stock_locations.fulfillment_sets.service_zones.shipping_options.provider.is_enabled",

        "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price.calculated_amount",
      ],
      variables: {
        id: input.sales_channel_id,
        "stock_locations.fulfillment_sets.service_zones.shipping_options": {
          context: {
            is_return: "false",
            enabled_in_store: "true",
          },
          filters: {
            address: {
              city: input.shipping_address?.city,
              country_code: input.shipping_address?.country_code,
              province_code: input.shipping_address?.province,
            },
          },
        },
        "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price":
          {
            context: {
              currency_code: input.currency_code,
            },
          },
      },
    })

    const shippingOptionsWithPrice = transform(
      { options: scLocationFulfillmentSets },
      (data) => {
        const optionsMissingPrices: string[] = []

        const options = deepFlatMap(
          data.options,
          "stock_locations.fulfillment_sets.service_zones.shipping_options.calculated_price",
          ({ shipping_options }) => {
            const { calculated_price, ...options } = shipping_options ?? {}

            if (options?.id && !calculated_price) {
              optionsMissingPrices.push(options.id)
            }

            return {
              ...options,
              amount: calculated_price?.calculated_amount,
            }
          }
        )

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

    return shippingOptionsWithPrice
  }
)
