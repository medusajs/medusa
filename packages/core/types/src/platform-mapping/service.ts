import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  FilterablePlatformSkuProps,
  FilterablePlatformSyncTaskProps,
  PlatformSkuDTO,
  PlatformSyncTaskDTO,
} from "./common"

/**
 * The main service interface for the Platform Mapping Module.
 */
export interface IPlatformMappingModuleService extends IModuleService {
  createPlatformSkus(
    data: unknown[],
    sharedContext?: Context
  ): Promise<PlatformSkuDTO[]>
  createPlatformSkus(
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSkuDTO>

  updatePlatformSkus(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSkuDTO>
  updatePlatformSkus(
    selector: FilterablePlatformSkuProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSkuDTO[]>

  deletePlatformSkus(ids: string[], sharedContext?: Context): Promise<void>
  deletePlatformSkus(id: string, sharedContext?: Context): Promise<void>

  retrievePlatformSku(
    id: string,
    config?: FindConfig<PlatformSkuDTO>,
    sharedContext?: Context
  ): Promise<PlatformSkuDTO>

  listPlatformSkus(
    filters?: FilterablePlatformSkuProps,
    config?: FindConfig<PlatformSkuDTO>,
    sharedContext?: Context
  ): Promise<PlatformSkuDTO[]>

  listAndCountPlatformSkus(
    filters?: FilterablePlatformSkuProps,
    config?: FindConfig<PlatformSkuDTO>,
    sharedContext?: Context
  ): Promise<[PlatformSkuDTO[], number]>

  createPlatformSyncTasks(
    data: unknown[],
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO[]>
  createPlatformSyncTasks(
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO>

  updatePlatformSyncTasks(
    id: string,
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO>
  updatePlatformSyncTasks(
    selector: FilterablePlatformSyncTaskProps,
    data: unknown,
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO[]>

  deletePlatformSyncTasks(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
  deletePlatformSyncTasks(
    id: string,
    sharedContext?: Context
  ): Promise<void>

  retrievePlatformSyncTask(
    id: string,
    config?: FindConfig<PlatformSyncTaskDTO>,
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO>

  listPlatformSyncTasks(
    filters?: FilterablePlatformSyncTaskProps,
    config?: FindConfig<PlatformSyncTaskDTO>,
    sharedContext?: Context
  ): Promise<PlatformSyncTaskDTO[]>

  listAndCountPlatformSyncTasks(
    filters?: FilterablePlatformSyncTaskProps,
    config?: FindConfig<PlatformSyncTaskDTO>,
    sharedContext?: Context
  ): Promise<[PlatformSyncTaskDTO[], number]>
}
