import {
  ConfigurableModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  TransactionBaseService,
  ICacheService,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {}

class InMemoryCacheService
  extends TransactionBaseService
  implements ICacheService
{
  protected readonly store = new Map()

  private readonly timestamps = new Map()

  constructor(
    deps: InjectedDependencies,
    options?: unknown,
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const now = Date.now()
    const validTill = this.timestamps.get(key)

    if (validTill && validTill < now) {
      this.store.delete(key)
      return null
    }

    return this.store.get(key)
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key)
  }

  async set(key: string, data: unknown, ttl?: number): Promise<void> {
    this.store.set(key, data)

    if (ttl) {
      this.timestamps.set(key, ttl)
    }
  }
}

export default InMemoryCacheService
