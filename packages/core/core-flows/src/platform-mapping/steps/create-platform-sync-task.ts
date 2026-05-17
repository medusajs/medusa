import { IPlatformMappingModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createPlatformSyncTaskStep = createStep(
  "create-platform-sync-task",
  async (
    input: {
      shop_id: string
      platform_type: string
      action: string
      payload: Record<string, unknown>
      [key: string]: unknown
    },
    { container }
  ) => {
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    const platformSyncTask = await platformMappingModule.createPlatformSyncTasks(input)
    return new StepResponse(platformSyncTask, platformSyncTask.id)
  },
  async (platformSyncTaskId, { container }) => {
    if (!platformSyncTaskId) return
    const platformMappingModule = container.resolve<IPlatformMappingModuleService>(
      Modules.PLATFORM_MAPPING
    )
    await platformMappingModule.deletePlatformSyncTasks(platformSyncTaskId)
  }
)
