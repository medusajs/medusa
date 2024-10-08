import { Context } from "../shared-context"

export interface ILockingProvider {
  execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
    },
    sharedContext?: Context
  ): Promise<T>
  acquire(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
    },
    sharedContext?: Context
  ): Promise<void>
  release(keys: string | string[], ownerId?: string | null): Promise<boolean>
  releaseAll(ownerId?: string | null): Promise<void>
}
