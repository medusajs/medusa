import { UpdateLineItemInCartWorkflowInputDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { MedusaError } from "medusa-core-utils"
import { useRemoteQueryStep } from "../../../common/steps/use-remote-query"
import { updateLineItemsStep } from "../../line-item/steps"
import {
  confirmInventoryStep,
  getVariantPriceSetsStep,
  getVariantsStep,
  refreshCartShippingMethodsStep,
} from "../steps"
import { refreshCartPromotionsStep } from "../steps/refresh-cart-promotions"
import { cartFieldsForRefreshSteps } from "../utils/fields"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"
import { refreshPaymentCollectionForCartStep } from "./refresh-payment-collection"

// TODO: The UpdateLineItemsWorkflow are missing the following steps:
// - Validate shipping methods for new items (fulfillment module)

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
export const updateLineItemInCartWorkflow = createWorkflow(
  updateLineItemInCartWorkflowId,
  (input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO>) => {
    const item = transform({ input }, (data) => data.input.item)

    const pricingContext = transform({ cart: input.cart, item }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
        customer_id: data.cart.customer_id,
      }
    })

    const variantIds = transform({ input }, (data) => [
      data.input.item.variant_id!,
    ])

    const salesChannelLocations = useRemoteQueryStep({
      entry_point: "sales_channels",
      fields: ["id", "name", "stock_locations.id", "stock_locations.name"],
      variables: { id: input.cart.sales_channel_id },
    })

    const productVariantInventoryItems = useRemoteQueryStep({
      entry_point: "product_variant_inventory_items",
      fields: ["variant_id", "inventory_item_id", "required_quantity"],
      variables: { variant_id: variantIds },
    }).config({ name: "inventory-items" })

    const variants = getVariantsStep({
      filter: { id: variantIds },
      config: { select: ["id", "manage_inventory"] },
    })

    const confirmInventoryInput = transform(
      { productVariantInventoryItems, salesChannelLocations, input, variants },
      (data) => {
        if (!data.salesChannelLocations.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Sales channel ${data.input.cart.sales_channel_id} is not associated with any stock locations.`
          )
        }

        const items = prepareConfirmInventoryInput({
          product_variant_inventory_items: data.productVariantInventoryItems,
          location_ids: data.salesChannelLocations[0].stock_locations.map(
            (l) => l.id
          ),
          items: [data.input.item],
          variants: data.variants.map((v) => ({
            id: v.id,
            manage_inventory: v.manage_inventory,
          })),
        })

        return { items }
      }
    )

    confirmInventoryStep(confirmInventoryInput)

    const priceSets = getVariantPriceSetsStep({
      variantIds,
      context: pricingContext,
    })

    const lineItemUpdate = transform({ input, priceSets, item }, (data) => {
      const price = data.priceSets[data.item.variant_id!].calculated_amount

      return {
        data: {
          ...data.input.update,
          unit_price: price,
        },
        selector: {
          id: data.input.item.id,
        },
      }
    })

    const result = updateLineItemsStep({
      data: lineItemUpdate.data,
      selector: lineItemUpdate.selector,
    })

    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: cartFieldsForRefreshSteps,
      variables: { id: input.cart.id },
      list: false,
    }).config({ name: "refetch–cart" })

    refreshCartShippingMethodsStep({ cart })
    refreshCartPromotionsStep({ id: input.cart.id })
    refreshPaymentCollectionForCartStep({ cart_id: input.cart.id })

    const updatedItem = transform({ result }, (data) => data.result?.[0])

    return updatedItem
  }
)
