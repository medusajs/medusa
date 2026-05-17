import { IPlatformMappingModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deletePlatformSyncTaskStep = createStep(
  "delete-platform-sync-task",
  async (input: { id: string }, { container }) => {
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    const platformSyncTask = await platformMappingModule.retrievePlatformSyncTask(
      input.id
    )
    await platformMappingModule.deletePlatformSyncTasks(input.id)
    return new StepResponse(void 0, platformSyncTask)
  },
  async (platformSyncTask, { container }) => {
    if (!platformSyncTask) return
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    await platformMappingModule.createPlatformSyncTasks(platformSyncTask)
  }
)
