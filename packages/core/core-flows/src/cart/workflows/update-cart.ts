import {
  AdditionalData,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import { MedusaError, PromotionActions } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  findOrCreateCustomerStep,
  findSalesChannelStep,
  refreshCartShippingMethodsStep,
  updateCartsStep,
} from "../steps"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"

export const updateCartWorkflowId = "update-cart"
/**
 * This workflow updates a cart.
 */
export const updateCartWorkflow = createWorkflow(
  updateCartWorkflowId,
  (input: WorkflowData<UpdateCartWorkflowInputDTO & AdditionalData>) => {
    const cartToUpdate = useRemoteQueryStep({
      entry_point: "cart",
      variables: { id: input.id },
      fields: ["id", "shipping_address.*", "region.*"],
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "get-cart" })

    const regionId = transform(
      { input, cartToUpdate },
      (data) => data.input.region_id || data.cartToUpdate.region_id
    )

    const [salesChannel, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    const region = when({ regionId }, (data) => {
      return !!data.regionId
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "region",
        variables: { id: regionId },
        fields: ["id", "countries.*", "currency_code", "name"],
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "get-region" })
    })

    const cartInput = transform(
      { input, region, customerData, salesChannel, cartToUpdate, regionId },
      (data) => {
        const { promo_codes, ...updateCartData } = data.input

        const data_ = {
          ...updateCartData,
          currency_code: data.region?.currency_code,
          region_id: data.region?.id, // This is either the region from the input or the region from the cart or null
        }

        // When the region is updated, we do a few things:
        // - If the shipping address country code is provided, we need to make sure the country is in the region
        //   - If not, we throw
        // - If the shipping address is not provided
        //   - Clear the shipping address if the region has more than one country
        //   - Set the country code if the region has only one country
        const regionIsNew = !!(
          data.cartToUpdate.region?.id &&
          data.region.id !== data.cartToUpdate.region?.id
        )
        const shippingAddress = data.input.shipping_address

        if (shippingAddress?.country_code) {
          // If shipping address with country is provided, we need to make sure the country is in the region
          const country = data.region.countries.find(
            (c) => c.iso_2 === shippingAddress.country_code
          )

          if (!country) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Country with code ${shippingAddress.country_code} is not within region ${data.region.name}`
            )
          }

          data_.shipping_address = {
            ...shippingAddress,
            country_code: country.iso_2,
          }
        }

        if (regionIsNew) {
          if (data.region.countries.length === 1) {
            data_.shipping_address = {
              country_code: data.region.countries[0].iso_2,
            }
          }

          if (!data_.shipping_address?.country_code) {
            data_.shipping_address = null
          }
        }

        if (
          updateCartData.customer_id !== undefined ||
          updateCartData.email !== undefined
        ) {
          data_.customer_id = data.customerData.customer?.id || null
          data_.email =
            data.input?.email ?? (data.customerData.customer?.email || null)
        }

        if (updateCartData.sales_channel_id !== undefined) {
          data_.sales_channel_id = data.salesChannel?.id || null
        }

        return data_
      }
    )

    const carts = updateCartsStep([cartInput])

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: cartInput.id },
      list: false,
    }).config({ name: "refetch–cart" })

    parallelize(
      refreshCartShippingMethodsStep({ cart }),
      updateTaxLinesWorkflow.runAsStep({
        input: {
          cart_id: carts[0].id,
        },
      })
    )

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: input.id,
        promo_codes: input.promo_codes,
        action: PromotionActions.REPLACE,
      },
    })

    refreshPaymentCollectionForCartWorkflow.runAsStep({
      input: {
        cart_id: input.id,
      },
    })

    const cartUpdated = createHook("cartUpdated", {
      cart,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(void 0, {
      hooks: [cartUpdated],
    })
  }
)
