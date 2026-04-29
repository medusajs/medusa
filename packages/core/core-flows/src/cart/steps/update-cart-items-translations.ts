import { MedusaContainer } from "@medusajs/framework"
import {
  ICartModuleService,
  ProductVariantDTO,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  deduplicate,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { applyTranslationsToItems } from "../../common/utils/apply-translations-to-items"
import { productVariantsFields } from "../utils/fields"

export interface UpdateCartItemsTranslationsStepInput {
  cart_id: string
  locale: string
  /**
   * Pre-loaded items to avoid re-fetching.
   */
  items?: { id: string; variant_id?: string; [key: string]: any }[]
}

const BATCH_SIZE = 100

const lineItemFields = [
  "id",
  "variant_id",
  "product_id",
  "title",
  "subtitle",
  "product_title",
  "product_description",
  "product_subtitle",
  "product_type",
  "product_collection",
  "product_handle",
  "variant_title",
]

export const updateCartItemsTranslationsStepId =
  "update-cart-items-translations"

type ItemTranslationSnapshot = {
  id: string
  title: string
  subtitle: string
  product_title: string
  product_description: string
  product_subtitle: string
  product_type: string
  product_collection: string
  product_handle: string
  variant_title: string
}

async function compensation(
  originalItems,
  { container }: { container: MedusaContainer }
) {
  if (!originalItems?.length) {
    return
  }

  const cartModule = container.resolve<ICartModuleService>(Modules.CART)

  for (let i = 0; i < originalItems.length; i += BATCH_SIZE) {
    const batch = originalItems.slice(i, i + BATCH_SIZE)
    await cartModule.updateLineItems(batch)
  }
}

/**
 * This step re-translates all cart line items when the cart's locale changes.
 * It fetches items and their variants in batches to handle large carts gracefully.
 */
export const updateCartItemsTranslationsStep = createStep(
  updateCartItemsTranslationsStepId,
  async (data: UpdateCartItemsTranslationsStepInput, { container }) => {
    const originalItems: ItemTranslationSnapshot[] = []
    try {
      const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

      if (!isTranslationEnabled) {
        return new StepResponse(void 0, [])
      }

      const cartModule = container.resolve<ICartModuleService>(Modules.CART)
      const query = container.resolve<RemoteQueryFunction>(
        ContainerRegistrationKeys.QUERY
      )

      const processBatch = async (
        items: { id: string; variant_id?: string; [key: string]: any }[]
      ) => {
        const variantIds = deduplicate(
          items
            .map((item) => item.variant_id)
            .filter((id): id is string => !!id)
        )

        if (variantIds.length === 0) {
          return
        }

        // Store original values before updating
        for (const item of items) {
          originalItems.push({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            product_title: item.product_title,
            product_description: item.product_description,
            product_subtitle: item.product_subtitle,
            product_type: item.product_type,
            product_collection: item.product_collection,
            product_handle: item.product_handle,
            variant_title: item.variant_title,
          })
        }

        const { data: variants } = await query.graph(
          {
            entity: "variants",
            filters: { id: variantIds },
            fields: productVariantsFields,
          },
          {
            locale: data.locale,
          }
        )

        const translatedItems = applyTranslationsToItems(
          items as { variant_id?: string; [key: string]: any }[],
          variants as Partial<ProductVariantDTO>[]
        )

        const itemsToUpdate = translatedItems
          .filter((item) => item.id)
          .map((item) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            product_title: item.product_title,
            product_description: item.product_description,
            product_subtitle: item.product_subtitle,
            product_type: item.product_type,
            product_collection: item.product_collection,
            product_handle: item.product_handle,
            variant_title: item.variant_title,
          }))

        if (itemsToUpdate.length > 0) {
          await cartModule.updateLineItems(itemsToUpdate)
        }
      }

      if (data.items?.length) {
        await processBatch(data.items)
        return new StepResponse(void 0, originalItems)
      }

      let offset = 0
      let hasMore = true

      while (hasMore) {
        const { data: items } = await query.graph({
          entity: "line_items",
          filters: { cart_id: data.cart_id },
          fields: lineItemFields,
          pagination: {
            take: BATCH_SIZE,
            skip: offset,
          },
        })

        if (items.length === 0) {
          hasMore = false
          break
        }

        await processBatch(items as { id: string; variant_id?: string }[])

        offset += items.length
        hasMore = items.length === BATCH_SIZE
      }

      return new StepResponse(void 0, originalItems)
    } catch (error) {
      await compensation(originalItems, { container })
      throw error
    }
  },
  compensation
)
