import {
  AddToCartWorkflowInputDTO,
  CartDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import {
  createLineItemsStep,
  getLineItemActionsStep,
  refreshCartShippingMethodsStep,
  updateLineItemsStep,
  validateVariantPricesStep,
} from "../steps"
import { validateCartStep } from "../steps/validate-cart"
import { productVariantsFields } from "../utils/fields"
import { prepareLineItemData } from "../utils/prepare-line-item-data"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"

export const addToCartWorkflowId = "add-to-cart"
/**
 * This workflow adds items to a cart.
 */
export const addToCartWorkflow = createWorkflow(
  addToCartWorkflowId,
  (input: WorkflowData<AddToCartWorkflowInputDTO>) => {
    validateCartStep(input)

    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? []).map((i) => i.variant_id)
    })

    // TODO: This is on par with the context used in v1.*, but we can be more flexible.
    const pricingContext = transform({ cart: input.cart }, (data) => {
      return {
        currency_code: data.cart.currency_code,
        region_id: data.cart.region_id,
        customer_id: data.cart.customer_id,
      }
    })

    const variants = useRemoteQueryStep({
      entry_point: "variants",
      fields: productVariantsFields,
      variables: {
        id: variantIds,
        calculated_price: {
          context: pricingContext,
        },
      },
      throw_if_key_not_found: true,
    })

    validateVariantPricesStep({ variants })

    const lineItems = transform({ input, variants }, (data) => {
      const items = (data.input.items ?? []).map((item) => {
        const variant = data.variants.find((v) => v.id === item.variant_id)!

        return prepareLineItemData({
          variant: variant,
          unitPrice:
            item.unit_price || variant.calculated_price.calculated_amount,
          isTaxInclusive:
            item.is_tax_inclusive ||
            variant.calculated_price.is_calculated_price_tax_inclusive,
          quantity: item.quantity,
          metadata: item?.metadata ?? {},
          cartId: data.input.cart.id,
        }) as CreateLineItemForCartDTO
      })

      return items
    })

    const { itemsToCreate = [], itemsToUpdate = [] } = getLineItemActionsStep({
      id: input.cart.id,
      items: lineItems,
    })

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: input.cart.sales_channel_id as string,
        variants,
        items: input.items,
        itemsToUpdate,
      },
    })

    const [createdItems, updatedItems] = parallelize(
      createLineItemsStep({
        id: input.cart.id,
        items: itemsToCreate,
      }),
      updateLineItemsStep({
        id: input.cart.id,
        items: itemsToUpdate,
      })
    )

    const newlyCreatedAndUpdatedItems = transform(
      { createdItems, updatedItems },
      ({ createdItems, updatedItems }) => {
        return [...createdItems, ...updatedItems]
      }
    )

    /**
     * Assign created and updated items to the cart to maintain sync
     */
    const cartWithUpdatedItems = transform(
      { cart: input.cart, createdItems, updatedItems },
      ({ cart, createdItems, updatedItems }) => {
        cart.items = (cart.items ?? []).concat(createdItems, updatedItems)
        cart.items = (cart.items ?? []).map((item) => {
          const updatedItem = updatedItems.find(
            (updatedItem) => updatedItem.id === item.id
          )
          if (updatedItem) {
            return updatedItem
          }
          return item
        })
        return cart as CartDTO & { items: CartDTO["items"] }
      }
    )

    const refreshedShippingMethods = refreshCartShippingMethodsStep({
      cart: cartWithUpdatedItems,
    })

    const cartWithFreshShippingMethods = transform(
      { cart: cartWithUpdatedItems, refreshedShippingMethods },
      (data) => {
        data.cart.shipping_methods = data.refreshedShippingMethods
        return data.cart as CartDTO
      }
    )

    updateTaxLinesWorkflow.runAsStep({
      input: {
        cart: cartWithFreshShippingMethods,
        items: newlyCreatedAndUpdatedItems,
      },
    })

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart: cartWithFreshShippingMethods,
      },
    })

    refreshPaymentCollectionForCartWorkflow.runAsStep({
      input: {
        cart: cartWithFreshShippingMethods,
      },
    })

    return new WorkflowResponse(newlyCreatedAndUpdatedItems)
  }
)
