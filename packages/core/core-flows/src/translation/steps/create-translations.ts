import {
  CreateTranslationDTO,
  ITranslationModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The translations to create.
 */
export type CreateTranslationsStepInput = CreateTranslationDTO[]

export const createTranslationsStepId = "create-translations"
/**
 * This step creates one or more translations.
 * 
 * @since 2.12.3
 * @featureFlag translation
 *
 * @example
 * const data = createTranslationsStep([
 *   {
 *     reference_id: "prod_123",
 *     reference: "product",
 *     locale: "fr-FR",
 *     translations: { title: "Produit", description: "Description du produit" }
 *   }
 * ])
 */
export const createTranslationsStep = createStep(
  createTranslationsStepId,
  async (data: CreateTranslationsStepInput, { container }) => {
    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    const created = await service.createTranslations(data)

    return new StepResponse(
      created,
      created.map((translation) => translation.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<ITranslationModuleService>(
      Modules.TRANSLATION
    )

    await service.deleteTranslations(createdIds)
  }
)
