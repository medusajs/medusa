import type { IProductModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const addImageToVariantsStepId = "add-image-to-variants"

/**
 * This step adds an image to one or more product variants.
 * 
 * @since 2.11.2
 *
 * @example
 * const data = addImageToVariantsStep({
 *   image_id: "img_123",
 *   add: ["variant_123", "variant_456"]
 * })
 */
export const addImageToVariantsStep = createStep(
  addImageToVariantsStepId,
  async (input: { image_id: string; add: string[] }, { container }) => {
    if (!input.add.length) {
      return new StepResponse([], { added: [], image_id: input.image_id })
    }

    const productModuleService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const data = input.add.map((variant_id) => ({
      image_id: input.image_id,
      variant_id,
    }))

    await productModuleService.addImageToVariant(data)

    return new StepResponse(input.add, {
      added: input.add,
      image_id: input.image_id,
    })
  },
  async (
    compensationData: { added: string[]; image_id: string } | undefined,
    { container }
  ) => {
    if (!compensationData?.added?.length || !compensationData?.image_id) {
      return
    }

    const productModuleService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const data = compensationData.added.map((variant_id) => ({
      image_id: compensationData.image_id,
      variant_id,
    }))

    await productModuleService.removeImageFromVariant(data)
  }
)
