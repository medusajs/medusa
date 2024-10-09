import {
  Context,
  ILockingModule,
  InternalModuleDeclaration,
} from "@medusajs/types"
import { EntityManager } from "@mikro-orm/core"
import { LockingDefaultProvider } from "@types"
import LockingProviderService from "./locking-provider"

type InjectedDependencies = {
  manager: EntityManager
  lockingProviderService: LockingProviderService
  [LockingDefaultProvider]: string
}

export default class LockingModuleService implements ILockingModule {
  protected manager: EntityManager
  protected providerService_: LockingProviderService
  protected defaultProviderId: string

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.manager = container.manager
    this.providerService_ = container.lockingProviderService
    this.defaultProviderId = container[LockingDefaultProvider]
  }

  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
      provider?: string
    },
    sharedContext: Context = {}
  ): Promise<T> {
    const providerId = args?.provider ?? this.defaultProviderId
    const provider =
      this.providerService_.retrieveProviderRegistration(providerId)

    return provider.execute(keys, job, args, sharedContext)
  }

  async acquire(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      expire?: number
      provider?: string
    },
    sharedContext: Context = {}
  ): Promise<void> {
    const providerId = args?.provider ?? this.defaultProviderId
    const provider =
      this.providerService_.retrieveProviderRegistration(providerId)

    await provider.acquire(keys, args, sharedContext)
  }

  async release(
    keys: string | string[],
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext: Context = {}
  ): Promise<boolean> {
    const providerId = args?.provider ?? this.defaultProviderId
    const provider =
      this.providerService_.retrieveProviderRegistration(providerId)

    return await provider.release(keys, args, sharedContext)
  }

  async releaseAll(
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext: Context = {}
  ): Promise<void> {
    const providerId = args?.provider ?? this.defaultProviderId
    const provider =
      this.providerService_.retrieveProviderRegistration(providerId)

    return await provider.releaseAll(args, sharedContext)
  }
}
