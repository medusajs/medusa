import { Context, InternalModuleDeclaration } from "@medusajs/types"
import { EntityManager } from "@mikro-orm/core"

import { ILockingProvider } from "@medusajs/types"

type InjectedDependencies = {
  manager: EntityManager
  provider: ILockingProvider
}

export default class LockingModuleService implements ILockingProvider {
  protected manager: EntityManager
  protected provider: ILockingProvider

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.manager = container.manager
    this.provider = container.provider
  }

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: { timeout?: number },
    sharedContext: Context = {}
  ): Promise<T> {
    return this.provider.execute(keys, job, args, sharedContext)
  }

  async acquire(
    keys: string | string[],
    args?: { ownerId?: string | null; expire?: number },
    sharedContext: Context = {}
  ): Promise<void> {
    await this.provider.acquire(keys, args, sharedContext)
  }

  async release(
    keys: string | string[],
    ownerId?: string | null
  ): Promise<boolean> {
    return this.provider.release(keys, ownerId)
  }

  async releaseAll(ownerId?: string | null): Promise<void> {
    await this.provider.releaseAll(ownerId)
  }
}
