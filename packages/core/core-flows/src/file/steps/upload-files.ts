import { IFileModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UploadFilesStepInput = {
  files: {
    filename: string
    mimeType: string
    content: string
    access: "public" | "private"
  }[]
}

export const uploadFilesStepId = "upload-files"
export const uploadFilesStep = createStep(
  uploadFilesStepId,
  async (data: UploadFilesStepInput, { container }) => {
    const service = container.resolve<IFileModuleService>(
      ModuleRegistrationName.FILE
    )
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

    const service = container.resolve<IFileModuleService>(
      ModuleRegistrationName.FILE
    )

    await service.deleteFiles(createdIds)
  }
)
