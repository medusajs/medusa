import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const deleteProductImageFilesStepId = "delete-product-image-files"

export type DeleteProductImageFilesStepInput = {
  urls: string[]
}

export const deleteProductImageFilesStep = createStep(
  deleteProductImageFilesStepId,
  async (data: DeleteProductImageFilesStepInput, { container }) => {
    const urls = data.urls ?? []

    if (!urls.length) {
      return new StepResponse(void 0)
    }

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fileModuleService = container.resolve(Modules.FILE)
    const provider = fileModuleService.getProvider()

    if (!provider.deleteByUrl) {
      return new StepResponse(void 0)
    }

    for (const url of urls) {
      try {
        await provider.deleteByUrl(url)
      } catch (e) {
        logger.warn(
          `Failed to delete the file of the removed product image ${url}: ${e.message}`
        )
      }
    }

    return new StepResponse(void 0)
  }
)
