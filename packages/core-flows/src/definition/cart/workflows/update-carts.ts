import { CartDTO, CartWorkflow } from "@medusajs/types"
import { PromotionActions, isPresent } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createLineItemAdjustmentsStep,
  createShippingMethodAdjustmentsStep,
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
  getActionsToComputeFromPromotionsStep,
  prepareAdjustmentsFromPromotionActionsStep,
  removeLineItemAdjustmentsStep,
  removeShippingMethodAdjustmentsStep,
  retrieveCartStep,
  updateCartsStep,
} from "../steps"

export const updateCartsWorkflowId = "update-carts"
export const updateCartsWorkflow = createWorkflow(
  updateCartsWorkflowId,
  (
    input: WorkflowData<CartWorkflow.UpdateCartWorkflowInputDTO>
  ): WorkflowData<CartDTO> => {
    const retrieveCartInput = {
      id: input.id,
      config: {
        relations: [
          "items",
          "items.adjustments",
          "shipping_methods",
          "shipping_methods.adjustments",
        ],
      },
    }

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

    updateCartsStep(cartInput)

    const cart = retrieveCartStep(retrieveCartInput)
    const actions = getActionsToComputeFromPromotionsStep({
      cart,
      promoCodes: input.promo_codes,
      action: PromotionActions.REPLACE,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
    } = prepareAdjustmentsFromPromotionActionsStep({ actions })

    parallelize(
      removeLineItemAdjustmentsStep({ lineItemAdjustmentIdsToRemove }),
      removeShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentIdsToRemove,
      })
    )

    parallelize(
      createLineItemAdjustmentsStep({ lineItemAdjustmentsToCreate }),
      createShippingMethodAdjustmentsStep({ shippingMethodAdjustmentsToCreate })
    )

    return retrieveCartStep(retrieveCartInput).config({
      name: "retrieve-cart-result-step",
    })
  }
)
