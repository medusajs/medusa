import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFileModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UploadFilesStepInput = {
  files: {
    filename: string
    mimeType: string
    content: string
  }[]
}

export const uploadFilesStepId = "upload-files"
export const uploadFilesStep = createStep(
  uploadFilesStepId,
  async (data: UploadFilesStepInput, { container }) => {
    const service = container.resolve<IFileModuleService>(
      ModuleRegistrationName.FILE
    )
    const created = await service.create(data.files)
    return new StepResponse(
      created,
      created.map((file) => file.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IFileModuleService>(
      ModuleRegistrationName.FILE
    )

    await service.delete(createdIds)
  }
)
