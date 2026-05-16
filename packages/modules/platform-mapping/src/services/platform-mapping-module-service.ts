import { MedusaService } from "@medusajs/framework/utils"
import PlatformSku from "../models/platform-sku"
import PlatformSyncTask from "../models/platform-sync-task"
import {
  CreatePlatformSkuDTO, UpdatePlatformSkuDTO,
  CreatePlatformSyncTaskDTO, UpdatePlatformSyncTaskDTO,
} from "../types"

export class PlatformMappingModuleService extends MedusaService<{
  PlatformSku: { dto: CreatePlatformSkuDTO; updateDto: UpdatePlatformSkuDTO }
  PlatformSyncTask: { dto: CreatePlatformSyncTaskDTO; updateDto: UpdatePlatformSyncTaskDTO }
}>({ PlatformSku, PlatformSyncTask }) {}
