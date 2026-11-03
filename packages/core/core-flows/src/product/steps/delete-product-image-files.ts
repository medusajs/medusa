import type { IFileModuleService, Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The URLs of the product image files to delete.
 */
export type DeleteProductImageFilesStepInput = string[]

export const deleteProductImageFilesStepId = "delete-product-image-files"

/**
 * This step deletes files from the File Module Provider by their URLs. It's
 * used when product images are removed, as the product image only stores the
 * file's URL.
 *
 * Providers that don't support deleting by URL are ignored, and a failed
 * deletion doesn't fail the workflow as the storage cleanup is best-effort.
 *
 * @example
 * const data = deleteProductImageFilesStep([
 *   "https://example.com/image.png"
 * ])
 */
export const deleteProductImageFilesStep = createStep(
  { name: deleteProductImageFilesStepId, noCompensation: true },
  async (urls: DeleteProductImageFilesStepInput, { container }) => {
    if (!urls?.length) {
      return new StepResponse(void 0)
    }

    const fileService = container.resolve<IFileModuleService>(Modules.FILE)
    const provider = fileService.getProvider()

    if (!provider.deleteByUrl) {
      return new StepResponse(void 0)
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)

    for (const url of urls) {
      try {
        await provider.deleteByUrl(url)
      } catch (e) {
        // Storage cleanup shouldn't fail an already committed product update
        logger.warn(
          `Failed to delete the product image file for URL "${url}": ${
            e instanceof Error ? e.message : e
          }`
        )
      }
    }

    return new StepResponse(void 0)
  },
  async () => {}
)
