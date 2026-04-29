import {
  AdditionalData,
  AddToCartWorkflowInputDTO,
  ConfirmVariantInventoryWorkflowInputDTO,
  CreateLineItemForCartDTO,
} from "@medusajs/framework/types"
import {
  CartWorkflowEvents,
  deduplicate,
  isDefined,
} from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { getTranslatedLineItemsStep, useQueryGraphStep } from "../../common"
import { emitEventStep } from "../../common/steps/emit-event"
import { acquireLockStep, releaseLockStep } from "../../locking"
import {
  createLineItemsStep,
  getLineItemActionsStep,
  updateLineItemsStep,
} from "../steps"
import { validateCartStep } from "../steps/validate-cart"
import { validateLineItemPricesStep } from "../steps/validate-line-item-prices"
import {
  cartFieldsForPricingContext,
  productVariantsFields,
} from "../utils/fields"
import { requiredVariantFieldsForInventoryConfirmation } from "../utils/prepare-confirm-inventory-input"
import {
  prepareLineItemData,
  PrepareLineItemDataInput,
  PrepareVariantLineItemInput,
} from "../utils/prepare-line-item-data"
import { pricingContextResult } from "../utils/schemas"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { getVariantsAndItemsWithPrices } from "./get-variants-and-items-with-prices"
import { refreshCartItemsWorkflow } from "./refresh-cart-items"

const cartFields = ["completed_at", "locale"].concat(
  cartFieldsForPricingContext
)

export const addToCartWorkflowId = "add-to-cart"
/**
 * This workflow adds a product variant to a cart as a line item. It's executed by the
 * [Add Line Item Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidlineitems).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to wrap custom logic around adding an item to the cart.
 * For example, you can use this workflow to add a line item to the cart with a custom price.
 *
 * @example
 * const { result } = await addToCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     items: [
 *       {
 *         variant_id: "variant_123",
 *         quantity: 1,
 *       },
 *       {
 *         variant_id: "variant_456",
 *         quantity: 1,
 *         unit_price: 20
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add a line item to a cart.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 * @property hooks.setPricingContext - This hook is executed after the cart is retrieved and before the line items are created. You can consume this hook to return any custom context useful for the prices retrieval of the variants to be added to the cart.
 *
 * For example, assuming you have the following custom pricing rule:
 *
 * ```json
 * {
 *   "attribute": "location_id",
 *   "operator": "eq",
 *   "value": "sloc_123",
 * }
 * ```
 *
 * You can consume the `setPricingContext` hook to add the `location_id` context to the prices calculation:
 *
 * ```ts
 * import { addToCartWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * addToCartWorkflow.hooks.setPricingContext((
 *   { cart, variantIds, items, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 *
 * The variants' prices will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 */
export const addToCartWorkflow = createWorkflow(
  {
    name: addToCartWorkflowId,
    idempotent: false,
  },
  (input: AddToCartWorkflowInputDTO & AdditionalData) => {
    acquireLockStep({
      key: input.cart_id,
      timeout: 2,
      ttl: 10,
    })

    const { data: cart } = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: cartFields,
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "get-cart" })

    validateCartStep({ cart })
    const validate = createHook("validate", {
      input,
      cart,
    })

    const variantIds = transform({ input }, (data): string[] => {
      return (data.input.items ?? [])
        .map((i) => i.variant_id)
        .filter((v): v is string => !!v)
    })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        cart,
        variantIds,
        items: input.items,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )

    const setPricingContextResult = setPricingContext.getResult()

    const { variants: variantsData, lineItems: lineItemsData } = when(
      "should-calculate-prices",
      { variantIds },
      ({ variantIds }) => {
        return !!variantIds.length
      }
    ).then(() => {
      const { variants: variantsData, lineItems: items } =
        getVariantsAndItemsWithPrices.runAsStep({
          input: {
            cart,
            items: input.items,
            setPricingContextResult: setPricingContextResult!,
            variants: {
              id: variantIds,
              fields: deduplicate([
                ...productVariantsFields,
                ...requiredVariantFieldsForInventoryConfirmation,
              ]),
            },
          },
        })

      const lineItems = transform({ items }, ({ items }) => {
        return items.map((item) => {
          return item.data as CreateLineItemForCartDTO
        })
      })

      return { variants: variantsData, lineItems }
    })

    const fetchedVariants = when(
      "fetch-variants",
      { variantsData, variantIds },
      ({ variantsData, variantIds }) => {
        return !variantsData?.length && !!variantIds.length
      }
    ).then(() => {
      return useQueryGraphStep({
        entity: "variants",
        fields: deduplicate([
          ...productVariantsFields,
          ...requiredVariantFieldsForInventoryConfirmation,
        ]),
        filters: {
          id: variantIds,
        },
        options: {
          cache: {
            enable: true,
          },
        },
      }).config({ name: "fetch-variants" })
    })

    const variants = transform(
      { variantsData, fetchedVariants },
      ({ variantsData, fetchedVariants }) => {
        return (variantsData ??
          fetchedVariants) as unknown as PrepareVariantLineItemInput[]
      }
    )

    const lineItems = transform(
      { cart_id: input.cart_id, items: input.items, lineItemsData, variants },
      ({ cart_id, items: items_, lineItemsData, variants }) => {
        if (lineItemsData?.length) {
          return lineItemsData
        }

        const items = (items_ ?? []).map((item) => {
          const variant = (variants ?? []).find(
            (v) => v.id === item.variant_id
          )!

          const input: PrepareLineItemDataInput = {
            item,
            variant: variant,
            cartId: cart_id,
            unitPrice: item.unit_price,
            isTaxInclusive:
              item.is_tax_inclusive ??
              variant?.calculated_price?.is_calculated_price_tax_inclusive,
            isCustomPrice: isDefined(item?.unit_price),
          }

          if (variant && !isDefined(input.unitPrice)) {
            input.unitPrice = variant.calculated_price?.calculated_amount
          }

          return prepareLineItemData(input)
        })

        return items
      }
    )

    validateLineItemPricesStep({ items: lineItems })

    const { itemsToCreate = [], itemsToUpdate = [] } = getLineItemActionsStep({
      id: cart.id,
      items: lineItems,
    })

    const itemsToConfirmInventory = transform(
      { itemsToUpdate, itemsToCreate },
      (data) => {
        return (data.itemsToUpdate as [])
          .concat(data.itemsToCreate as [])
          .filter(
            (
              item:
                | {
                    data: { variant_id: string }
                  }
                | { variant_id?: string }
            ) =>
              isDefined(
                "data" in item ? item.data?.variant_id : item.variant_id
              )
          ) as unknown as ConfirmVariantInventoryWorkflowInputDTO["itemsToUpdate"]
      }
    )

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: cart.sales_channel_id,
        variants:
          variants as unknown as ConfirmVariantInventoryWorkflowInputDTO["variants"],
        items: input.items,
        itemsToUpdate: itemsToConfirmInventory,
      },
    })

    const itemsToCreateVariants = transform(
      { itemsToCreate, variants } as {
        itemsToCreate: CreateLineItemForCartDTO[]
        variants: PrepareVariantLineItemInput[]
      },
      (data) => {
        if (!data.itemsToCreate?.length) {
          return []
        }

        const variantsMap = new Map(data.variants?.map((v) => [v.id, v]))
        return data.itemsToCreate
          .map((item) => item.variant_id && variantsMap.get(item.variant_id))
          .filter(Boolean) as PrepareVariantLineItemInput[]
      }
    )

    const translatedItemsToCreate = getTranslatedLineItemsStep({
      items: itemsToCreate,
      variants: itemsToCreateVariants,
      locale: cart.locale,
    })

    const [createdLineItems, updatedLineItems] = parallelize(
      createLineItemsStep({
        id: cart.id,
        items: translatedItemsToCreate,
      }),
      updateLineItemsStep({
        id: cart.id,
        items: itemsToUpdate,
      })
    )

    const allItems = transform(
      { createdLineItems, updatedLineItems },
      ({ createdLineItems = [], updatedLineItems = [] }) => {
        return createdLineItems.concat(updatedLineItems)
      }
    )

    refreshCartItemsWorkflow.runAsStep({
      input: {
        cart_id: cart.id,
        items: allItems,
        additional_data: input.additional_data,
      },
    })

    parallelize(
      emitEventStep({
        eventName: CartWorkflowEvents.UPDATED,
        data: { id: cart.id },
      }),
      releaseLockStep({
        key: cart.id,
      })
    )

    return new WorkflowResponse(void 0, {
      hooks: [validate, setPricingContext] as const,
    })
  }
)
