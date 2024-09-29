import {
  AdditionalData,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  PromotionActions,
  isPresent,
} from "@medusajs/framework/utils"
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

    const cartInput = transform(
      { input, region, customerData, salesChannel },
      (data) => {
        const { promo_codes, ...updateCartData } = data.input
        const data_ = { ...updateCartData }

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
          cartId: carts[0].id,
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
