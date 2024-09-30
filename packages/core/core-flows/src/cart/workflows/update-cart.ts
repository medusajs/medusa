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
      fields: ["id", "shipping_address.*", "region_id"],
      list: false,
    })

    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: input.region_id ?? cartToUpdate.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    const cartInput = transform(
      { input, region, customerData, salesChannel },
      (data) => {
        const { promo_codes, ...updateCartData } = data.input
        if (!data.region) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Region not found")
        }

        const data_ = {
          ...updateCartData,
          currency_code: data.region.currency_code,
          region_id: data.region.id,
        }

        // When the region is updated, we clear the shipping address
        //   If the region has only one country, we also set the shipping address to that country
        if (input.region_id !== data.region.id) {
          data_.shipping_address =
            data.region.countries.length === 1
              ? { country_code: data.region.countries[0].iso_2 }
              : null
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
