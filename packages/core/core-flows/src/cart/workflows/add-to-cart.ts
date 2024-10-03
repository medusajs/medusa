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

    const createdItemIds = transform({ createdItems }, ({ createdItems }) => {
      return createdItems.map((item) => item.id)
    })

    /**
     * Fetch newly created items to gather additional data
     */
    const createItemsData = useRemoteQueryStep({
      entry_point: "line_items",
      fields: [
        "id",
        "product.id",
        "product.collection.id",
        "product.categories.id",
        "product.tags.id",
      ],
      variables: {
        id: createdItemIds,
      },
      list: true,
    }).config({ name: "created-items-data" })

    /**
     * Assign created and updated items to the cart to maintain sync
     */
    const cartWithUpdatedItems = transform(
      { cart: input.cart, createdItems, createItemsData, updatedItems },
      ({ cart, createdItems, createItemsData, updatedItems }) => {
        cart.items ??= []
        cart.items = cart.items.map((item) => {
          const updatedItem = updatedItems.find(
            (updatedItem) => updatedItem.id === item.id
          )

          if (updatedItem) {
            return Object.assign(item, updatedItem)
          }

          return item
        })

        const fullCreatedItems = (createdItems ?? []).map((item) => {
          return Object.assign(
            item,
            createItemsData.find((data) => data.id === item.id)
          )
        })
        cart.items = cart.items.concat(fullCreatedItems)

        return cart as CartDTO & { items: CartDTO["items"] }
      }
    )

    const refreshedShippingMethods = refreshCartShippingMethodsStep({
      cart: cartWithUpdatedItems,
    })

    /**
     * Once the shipping are refreshed, we need to remove the ones that are no longer valid
     * from the cart
     */
    const cartWithFreshShippingMethods = transform(
      { cart: cartWithUpdatedItems, refreshedShippingMethods },
      (data) => {
        if (!data.refreshedShippingMethods?.length) {
          data.cart.shipping_methods = []
          return data.cart
        }

        const shippingMethodIdsLeft = new Set(
          data.refreshedShippingMethods?.map((shippingMethod) => {
            return shippingMethod.id
          })
        )

        data.cart.shipping_methods = (data.cart.shipping_methods ?? []).filter(
          (shippingMethod) => {
            return !shippingMethodIdsLeft.has(shippingMethod.id)
          }
        )

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
