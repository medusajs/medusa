import type { IFileModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to upload files.
 */
export type UploadFilesStepInput = {
  /**
   * The files to upload.
   */
  files: {
    /**
     * The name of the file.
     */
    filename: string
    /**
     * The MIME type of the file.
     *
     * @example
     * img/jpg
     */
    mimeType: string
    /**
     * The content of the file. For images, for example,
     * use base64 string. For CSV files, use the CSV content.
     */
    content: string
    /**
     * The access level of the file. Use `public` for the file that
     * can be accessed by anyone. For example, for images that are displayed
     * on the storefront. Use `private` for files that are only accessible
     * by authenticated users. For example, for CSV files used to
     * import data.
     */
    access: "public" | "private"
  }[]
}

export const uploadFilesStepId = "upload-files"
/**
 * This step uploads one or more files using the installed
 * [File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file).
 *
 * @example
 * const data = uploadFilesStep({
 *   files: [
 *     {
 *       filename: "test.jpg",
 *       mimeType: "img/jpg",
 *       content: "base64-string",
 *       access: "public"
 *     }
 *   ]
 * })
 */
export const uploadFilesStep = createStep(
  uploadFilesStepId,
  async (data: UploadFilesStepInput, { container }) => {
    const service = container.resolve<IFileModuleService>(Modules.FILE)
    const created = await service.createFiles(data.files)
    return new StepResponse(
      created,
      created.map((file) => file.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IFileModuleService>(Modules.FILE)

    await service.deleteFiles(createdIds)
  }
)
