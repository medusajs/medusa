import {
  AdditionalData,
  CartDTO,
  CustomerDTO,
  RegionDTO,
  UpdateLineItemInCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  CartWorkflowEvents,
  deduplicate,
  filterObjectByKeys,
  isDefined,
  MathBN,
  MedusaError,
  QueryContext,
} from "@medusajs/framework/utils"
import {
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { emitEventStep } from "../../common/steps/emit-event"
import { deleteLineItemsWorkflow } from "../../line-item"
import { updateLineItemsStepWithSelector } from "../../line-item/steps"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { validateCartStep } from "../steps/validate-cart"
import { validateVariantPricesStep } from "../steps/validate-variant-prices"
import {
  cartFieldsForPricingContext,
  productVariantsFields,
} from "../utils/fields"
import { requiredVariantFieldsForInventoryConfirmation } from "../utils/prepare-confirm-inventory-input"
import { pricingContextResult } from "../utils/schemas"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { refreshCartItemsWorkflow } from "./refresh-cart-items"

const cartFields = cartFieldsForPricingContext.concat(["items.*"])
const variantFields = deduplicate(
  productVariantsFields.concat([
    "calculated_price.*",
    ...requiredVariantFieldsForInventoryConfirmation
  ])
)

interface CartQueryDTO extends Omit<CartDTO, "items"> {
  items: NonNullable<CartDTO["items"]>
  customer: CustomerDTO
  region: RegionDTO
}

interface FindLineItemToUpdateStepInput {
  cart: CartQueryDTO
  input: UpdateLineItemInCartWorkflowInputDTO & AdditionalData
}

/**
 * This step finds the line item to update in the cart and collects its variant
 * id. It throws an error if the line item isn't found in the cart.
 */
export const findLineItemToUpdateStep = createStep(
  "find-line-item-to-update",
  async ({ cart, input }: FindLineItemToUpdateStepInput) => {
    const item = cart.items.find((i) => i.id === input.item_id)
    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Line item with id: ${input.item_id} was not found`
      )
    }

    const variantIds = [item.variant_id].filter(Boolean)
    return new StepResponse({ item, variantIds })
  }
)

interface PrepareLineItemUpdateStepInput {
  input: UpdateLineItemInCartWorkflowInputDTO & AdditionalData
  variants: any
  item: CartQueryDTO["items"][number]
}

/**
 * This step builds the update payload for a cart line item, resolving its unit
 * price (from the input, the variant's calculated price, or the existing item)
 * and tax inclusivity. It throws an error if the resulting unit price is unset.
 */
export const prepareLineItemUpdateStep = createStep(
  "prepare-line-item-update",
  async ({ input, variants, item }: PrepareLineItemUpdateStepInput) => {
    const variant = variants?.[0] ?? undefined

    const updateData = {
      ...input.update,
      unit_price: isDefined(input.update.unit_price)
        ? input.update.unit_price
        : item.unit_price,
      is_custom_price: isDefined(input.update.unit_price)
        ? true
        : item.is_custom_price,
      is_tax_inclusive:
        item.is_tax_inclusive ||
        variant?.calculated_price?.is_calculated_price_tax_inclusive,
    }

    if (variant && !updateData.is_custom_price) {
      updateData.unit_price = variant.calculated_price.calculated_amount
    }

    if (!isDefined(updateData.unit_price)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Line item ${item.title} has no unit price`
      )
    }

    return new StepResponse({
      data: updateData,
      selector: {
        id: input.item_id,
      },
    })
  }
)

export const updateLineItemInCartWorkflowId = "update-line-item-in-cart"
/**
 * This workflow updates a line item's details in a cart. You can update the line item's quantity, unit price, and more.
 * If the quantity is set to 0, the item will be removed from the cart.
 * This workflow is executed by the [Update Line Item Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidlineitemsline_id).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to update a line item's details in your custom flows.
 *
 * @example
 * const { result } = await updateLineItemInCartWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     item_id: "item_123",
 *     update: {
 *       quantity: 2
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update a cart's line item.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 * @property hooks.setPricingContext - This hook is executed before the cart is updated. You can consume this hook to return any custom context useful for the prices retrieval of the line item's variant.
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
 * The variant's prices will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 */
export const updateLineItemInCartWorkflow = createWorkflow(
  {
    name: updateLineItemInCartWorkflowId,
    idempotent: false,
  },
  (
    input: WorkflowData<UpdateLineItemInCartWorkflowInputDTO & AdditionalData>
  ) => {
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

    const { item, variantIds } = findLineItemToUpdateStep({ cart, input })

    validateCartStep({ cart })

    const validate = createHook("validate", {
      input,
      cart,
    })

    const setPricingContext = createHook(
      "setPricingContext",
      {
        cart,
        item,
        variantIds,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )

    const setPricingContextResult = setPricingContext.getResult()

    const pricingContext = transform(
      { cart, item, update: input.update, setPricingContextResult },
      (data): Record<string, any> => {
        return {
          ...filterObjectByKeys(data.cart, cartFieldsForPricingContext),
          ...(data.setPricingContextResult ? data.setPricingContextResult : {}),
          quantity: data.update.quantity ?? data.item.quantity,
          currency_code: data.cart.currency_code,
          region_id: data.cart.region_id!,
          region: data.cart.region!,
          customer_id: data.cart.customer_id!,
          customer: data.cart.customer!,
        }
      }
    )

    const shouldRemoveItem = transform(
      { input },
      ({ input }) =>
        !!(
          isDefined(input.update.quantity) &&
          MathBN.eq(input.update.quantity, 0)
        )
    )

    when(
      "should-remove-item",
      { shouldRemoveItem },
      ({ shouldRemoveItem }) => shouldRemoveItem
    ).then(() => {
      deleteLineItemsWorkflow.runAsStep({
        input: {
          cart_id: input.cart_id,
          ids: [input.item_id],
          additional_data: input.additional_data,
        },
      })
    })

    const variants = when(
      "should-fetch-variants",
      { variantIds, shouldRemoveItem },
      ({ variantIds, shouldRemoveItem }) => {
        return !!variantIds.length && !shouldRemoveItem
      }
    ).then(() => {
      const calculatedPriceQueryContext = transform(
        { pricingContext },
        ({ pricingContext }) => {
          return QueryContext(pricingContext)
        }
      )

      const { data: variants } = useQueryGraphStep({
        entity: "variants",
        fields: variantFields,
        filters: {
          id: variantIds,
        },
        context: {
          calculated_price: calculatedPriceQueryContext,
        },
      }).config({ name: "fetch-variants" })

      validateVariantPricesStep({ variants })

      return variants
    })

    when(
      "should-update-item",
      { shouldRemoveItem },
      ({ shouldRemoveItem }) => !shouldRemoveItem
    ).then(() => {
      const items = transform({ input, item }, (data) => {
        return [
          Object.assign(data.item, { quantity: data.input.update.quantity }),
        ]
      })

      confirmVariantInventoryWorkflow.runAsStep({
        input: {
          sales_channel_id: pricingContext.sales_channel_id,
          variants,
          items,
        },
      })

      const lineItemUpdate = prepareLineItemUpdateStep({
        input,
        variants,
        item,
      })

      updateLineItemsStepWithSelector(lineItemUpdate)

      refreshCartItemsWorkflow.runAsStep({
        input: {
          cart_id: input.cart_id,
          additional_data: input.additional_data,
        },
      })
    })

    parallelize(
      releaseLockStep({
        key: input.cart_id,
      }),
      emitEventStep({
        eventName: CartWorkflowEvents.UPDATED,
        data: { id: input.cart_id },
      })
    )

    return new WorkflowResponse(void 0, {
      hooks: [validate, setPricingContext] as const,
    })
  }
)
