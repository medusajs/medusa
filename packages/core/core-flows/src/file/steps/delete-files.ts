import type { IFileModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the files to delete.
 */
export type DeleteFilesStepInput = string[]

export const deleteFilesStepId = "delete-files"
/**
 * This step deletes one or more files using the installed
 * [File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file). The files
 * will be removed from the database and the storage.
 *
 * @example
 * const data = deleteFilesStep([
 *   "id_123"
 * ])
 */
export const deleteFilesStep = createStep(
  { name: deleteFilesStepId, noCompensation: true },
  async (ids: DeleteFilesStepInput, { container }) => {
    const service = container.resolve<IFileModuleService>(Modules.FILE)

    await service.deleteFiles(ids)
    return new StepResponse(void 0)
  },
  async () => {}
)
