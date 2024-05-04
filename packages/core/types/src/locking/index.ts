import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"

export interface ILockingModuleService extends IModuleService {
  execute<T>(
    key: string,
    job: () => Promise<T>,
    timeoutSeconds?: number,
    sharedContext?: Context
  )
  acquire(
    key: string,
    ownerId?: string,
    expire?: number,
    sharedContext?: Context
  ): Promise<void>
  release(
    key: string,
    ownerId?: string,
    sharedContext?: Context
  ): Promise<boolean>
  releaseAll(ownerId?: string, sharedContext?: Context): Promise<void>
}
