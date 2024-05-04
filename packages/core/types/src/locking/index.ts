import { IModuleService } from "../modules-sdk"

export interface ILockingService extends IModuleService {
  execute<T>(key: string, job: () => Promise<T>, timeoutSeconds?: number)
  acquire(key: string, ownerId?: string, expire?: number): Promise<void>
  release(key: string, ownerId?: string): Promise<boolean>
  releaseAll(ownerId?: string): Promise<void>
}
