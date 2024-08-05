import { UpdateCartWorkflowInputDTO } from "@medusajs/types"
import { MedusaError, PromotionActions, isPresent } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
  refreshCartShippingMethodsStep,
  updateCartsStep,
} from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"

export const updateCartWorkflowId = "update-cart"
export const updateCartWorkflow = createWorkflow(
  updateCartWorkflowId,
  (input: WorkflowData<UpdateCartWorkflowInputDTO>): WorkflowData<void> => {
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
      updateTaxLinesStep({ cart_or_cart_id: carts[0].id }),
      refreshCartPromotionsStep({
        id: input.id,
        promo_codes: input.promo_codes,
        action: PromotionActions.REPLACE,
      })
    )

    refreshPaymentCollectionForCartWorkflow.runAsStep({
      input: {
        cart_id: input.id,
      },
    })
  }
)
