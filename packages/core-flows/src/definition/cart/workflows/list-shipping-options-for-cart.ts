import { ListShippingOptionsForCartWorkflowInputDTO } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { listShippingOptionsForContextStep } from "../../../shipping-options"
import { getShippingOptionPriceSetsStep } from "../steps"

export const listShippingOptionsForCartWorkflowId =
  "list-shipping-options-for-cart"
export const listShippingOptionsForCartWorkflow = createWorkflow(
  listShippingOptionsForCartWorkflowId,
  (input: WorkflowData<ListShippingOptionsForCartWorkflowInputDTO>) => {
    const scLocationFulfillmentSets = useRemoteQueryStep({
      entry_point: "sales_channels",
      fields: ["stock_locations.fulfillment_sets.id"],
      variables: { id: input.sales_channel_id },
    })

    const listOptionsInput = transform(
      { scLocationFulfillmentSets, input },
      (data) => {
        const fulfillmentSetIds = data.scLocationFulfillmentSets
          .map((sc) =>
            sc.stock_locations.map((loc) =>
              loc.fulfillment_sets.map(({ id }) => id)
            )
          )
          .flat(2)

        return {
          context: {
            fulfillment_set_id: fulfillmentSetIds,
            address: {
              city: data.input.shipping_address?.city,
              country_code: data.input.shipping_address?.country_code,
              province_code: data.input.shipping_address?.province,
            },
          },
          config: {
            select: [
              "id",
              "name",
              "price_type",
              "service_zone_id",
              "shipping_profile_id",
              "provider_id",
              "data",
              "amount",
            ],
            relations: ["type", "provider"],
          },
        }
      }
    )

    const options = listShippingOptionsForContextStep(listOptionsInput)

    const optionIds = transform({ options }, (data) =>
      data.options.map((option) => option.id)
    )

    // TODO: Separate shipping options based on price_type, flat_rate vs calculated
    const priceSets = getShippingOptionPriceSetsStep({
      optionIds,
      context: {
        currency_code: input.currency_code,
      },
    })

    const shippingOptionsWithPrice = transform(
      { priceSets, options },
      (data) => {
        const options = data.options.map((option) => {
          const price = data.priceSets?.[option.id].calculated_amount

          return {
            ...option,
            amount: price,
          }
        })

        return options
      }
    )

    return shippingOptionsWithPrice
  }
)
