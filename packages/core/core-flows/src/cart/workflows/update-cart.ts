import {
  AdditionalData,
  CartDTO,
  RegionDTO,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  PromotionActions,
  isPresent,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowData,
  WorkflowResponse,
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
  refreshCartShippingMethodsStep,
  updateCartsStep,
} from "../steps"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"

/*
 * When changing the region on the cartyou are changing the set of countries that your
 * cart can be shipped to so we need to make sure that the current shipping
 * address adheres to the new country set.
 */
const setShippingAddress = createStep(
  "set-shipping-address",
  async (data: { region: RegionDTO; cart: CartDTO }) => {
    const { region, cart } = data

    const countryCode = cart.shipping_address?.country_code

    let shippingAddress = cart.shipping_address ?? {}

    if (countryCode) {
      const countryNotInRegion = region.countries.find(
        (c) => c.iso_2 !== countryCode
      )

      if (countryNotInRegion) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Country ${countryCode} not found in region ${region.name}`
        )
      }

      shippingAddress = {
        ...shippingAddress,
        country_code: countryCode,
      }
    }

    if (!countryCode) {
      if (region.countries.length === 1) {
        shippingAddress = {
          ...shippingAddress,
          country_code: region.countries[0].iso_2,
        }
      } else {
        shippingAddress = {
          ...shippingAddress,
          country_code: undefined,
        }
      }
    }

    return new StepResponse(shippingAddress)
  }
)

export const updateCartWorkflowId = "update-cart"
/**
 * This workflow updates a cart.
 */
export const updateCartWorkflow = createWorkflow(
  updateCartWorkflowId,
  (input: WorkflowData<UpdateCartWorkflowInputDTO & AdditionalData>) => {
    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: input.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    const cartToUpdate = useRemoteQueryStep({
      entry_point: "cart",
      variables: { id: input.id },
      fields: ["id", "shipping_address.*", "region_id"],
    })

    // If the input region id is the same as the cart's region id, we don't need to do anything about the shipping address
    const shippingAddress = when({ cartToUpdate, input }, (data) => {
      return data.input.region_id !== data.cartToUpdate.region_id
    }).then(() => {
      return setShippingAddress({ region, cart: cartToUpdate })
    })

    const cartInput = transform(
      { input, region, customerData, salesChannel, shippingAddress },
      (data) => {
        const { promo_codes, ...updateCartData } = data.input
        const data_ = {
          ...updateCartData,
          shipping_address: data.shippingAddress,
        }

        if (isPresent(updateCartData.region_id)) {
          if (!data.region) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              "Region not found"
            )
          }

          data_.currency_code = data.region.currency_code
          data_.region_id = data.region.id
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
          cart_or_cart_id: carts[0].id,
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
