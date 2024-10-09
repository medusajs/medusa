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
  release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
    },
    sharedContext?: Context
  ): Promise<boolean>
  releaseAll(
    args?: {
      ownerId?: string | null
    },
    sharedContext?: Context
  ): Promise<void>
}

export interface ILockingModule {
  execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
      provider?: string
    },
    sharedContext?: Context
  ): Promise<T>
  acquire(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void>
  release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext?: Context
  ): Promise<boolean>
  releaseAll(
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void>
}
