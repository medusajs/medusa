import { MedusaContainer } from "@medusajs/framework"
import {
  IOrderModuleService,
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

export interface UpdateOrderItemsTranslationsStepInput {
  order_id: string
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

export const updateOrderItemsTranslationsStepId =
  "update-order-items-translations"

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
  originalItems: ItemTranslationSnapshot[] | undefined,
  { container }: { container: MedusaContainer }
) {
  if (!originalItems?.length) {
    return
  }

  const orderModule = container.resolve<IOrderModuleService>(Modules.ORDER)

  for (let i = 0; i < originalItems.length; i += BATCH_SIZE) {
    const batch = originalItems.slice(i, i + BATCH_SIZE)
    await orderModule.updateOrderLineItems(
      batch.map((item) => ({
        selector: { id: item.id },
        data: {
          title: item.title,
          subtitle: item.subtitle,
          product_title: item.product_title,
          product_description: item.product_description,
          product_subtitle: item.product_subtitle,
          product_type: item.product_type,
          product_collection: item.product_collection,
          product_handle: item.product_handle,
          variant_title: item.variant_title,
        },
      }))
    )
  }
}

/**
 * This step re-translates all order line items when the order's locale changes.
 * It fetches items and their variants in batches to handle large orders gracefully.
 */
export const updateOrderItemsTranslationsStep = createStep(
  updateOrderItemsTranslationsStepId,
  async (data: UpdateOrderItemsTranslationsStepInput, { container }) => {
    const originalItems: ItemTranslationSnapshot[] = []
    try {
      const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

      if (!isTranslationEnabled || !data.locale) {
        return new StepResponse(void 0, [])
      }

      const orderModule = container.resolve<IOrderModuleService>(Modules.ORDER)
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
            selector: { id: item.id },
            data: {
              title: item.title,
              subtitle: item.subtitle,
              product_title: item.product_title,
              product_description: item.product_description,
              product_subtitle: item.product_subtitle,
              product_type: item.product_type,
              product_collection: item.product_collection,
              product_handle: item.product_handle,
              variant_title: item.variant_title,
            },
          }))

        if (itemsToUpdate.length > 0) {
          await orderModule.updateOrderLineItems(itemsToUpdate)
        }
      }

      if (data.items?.length) {
        await processBatch(data.items)
        return new StepResponse(void 0, originalItems)
      }

      const { data: orders } = await query.graph({
        entity: "orders",
        filters: { id: data.order_id },
        fields: lineItemFields.map((f) => `items.${f}`),
      })

      const orderData = orders[0] as {
        items?: { id: string; variant_id?: string }[]
      }
      const items = orderData?.items ?? []

      // Process items in batches
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE)
        await processBatch(batch)
      }

      return new StepResponse(void 0, originalItems)
    } catch (error) {
      await compensation(originalItems, { container })
      throw error
    }
  },
  compensation
)
