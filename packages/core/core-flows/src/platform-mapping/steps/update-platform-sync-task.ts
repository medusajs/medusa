import { IPlatformMappingModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updatePlatformSyncTaskStep = createStep(
  "update-platform-sync-task",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    const platformSyncTask = await platformMappingModule.updatePlatformSyncTasks(
      input.id,
      input
    )
    return new StepResponse(platformSyncTask, platformSyncTask)
  },
  async (originalPlatformSyncTask, { container }) => {
    if (!originalPlatformSyncTask) return
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    await platformMappingModule.updatePlatformSyncTasks(
      originalPlatformSyncTask.id,
      originalPlatformSyncTask
    )
  }
)
