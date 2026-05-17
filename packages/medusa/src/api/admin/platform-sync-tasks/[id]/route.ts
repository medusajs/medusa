import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdatePlatformSyncTaskType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platform_sync_task =
    await platformMappingModule.retrievePlatformSyncTask(
      req.params.id,
      req.queryConfig
    )

  if (!platform_sync_task) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `PlatformSyncTask with id: ${req.params.id} was not found`
    )
  }

  res.json({ platform_sync_task })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdatePlatformSyncTaskType>,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  const platform_sync_task =
    await platformMappingModule.updatePlatformSyncTasks(
      req.params.id,
      req.validatedBody
    )

  res.json({ platform_sync_task })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const platformMappingModule = req.scope.resolve(Modules.PLATFORM_MAPPING)
  await platformMappingModule.deletePlatformSyncTasks(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "platform_sync_task",
    deleted: true,
  })
}
