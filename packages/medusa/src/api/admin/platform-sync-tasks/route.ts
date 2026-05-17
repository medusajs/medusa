import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { PlatformMappingModuleService } from "@medusajs/platform-mapping/dist/services/platform-mapping-module-service"
import { AdminCreatePlatformSyncTaskType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(
    Modules.PLATFORM_MAPPING
  ) as PlatformMappingModuleService
  const [platform_sync_tasks, count] =
    await platformMappingModule.listAndCountPlatformSyncTasks(
      req.filterableFields,
      req.queryConfig
    )

  res.json({
    platform_sync_tasks,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePlatformSyncTaskType>,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(
    Modules.PLATFORM_MAPPING
  ) as PlatformMappingModuleService
  const platform_sync_task =
    await platformMappingModule.createPlatformSyncTasks(req.validatedBody)

  res.status(200).json({ platform_sync_task })
}
