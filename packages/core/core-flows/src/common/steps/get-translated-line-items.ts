import { ProductVariantDTO } from "@medusajs/framework/types"
import { applyTranslations, FeatureFlag } from "@medusajs/framework/utils"
import {
  createStep,
  StepFunction,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { applyTranslationsToItems } from "../utils/apply-translations-to-items"

export interface GetTranslatedLineItemsStepInput<T> {
  items: T[] | undefined
  variants: Partial<ProductVariantDTO>[]
  locale: string | null | undefined
}

export const getTranslatedLineItemsStepId = "get-translated-line-items"

const step = createStep(
  getTranslatedLineItemsStepId,
  async (data: GetTranslatedLineItemsStepInput<any>, { container }) => {
    const isTranslationEnabled = FeatureFlag.isFeatureEnabled("translation")

    if (!isTranslationEnabled || !data.locale || !data.items?.length) {
      return new StepResponse(data.items ?? [])
    }

    await applyTranslations({
      localeCode: data.locale,
      objects: data.variants,
      container,
    })

    const translatedItems = applyTranslationsToItems(data.items, data.variants)

    return new StepResponse(translatedItems)
  }
)

/**
 * This step translates cart line items based on their associated variant and product IDs.
 * It fetches translations for the product (title, description, subtitle) and variant (title),
 * then applies them to the corresponding line item fields.
 */
export const getTranslatedLineItemsStep = <T>(
  data: GetTranslatedLineItemsStepInput<T>
): ReturnType<StepFunction<any, T[]>> =>
  step(data) as unknown as ReturnType<StepFunction<any, T[]>>
