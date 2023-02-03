import {
  ConfigurableModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  TransactionBaseService,
  ICacheService,
} from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"

import { CacheRecord, InMemoryCacheModuleOptions } from "../types"

const DEFAULT_TTL = 30 // seconds

type InjectedDependencies = {}

/**
 * Class represents basic, in-memory, cache store.
 */
class InMemoryCacheService
  extends TransactionBaseService
  implements ICacheService
{
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected TTL: number

  protected readonly timoutRefs = {}
  protected readonly store = new Map<string, CacheRecord<any>>()

  constructor(
    deps: InjectedDependencies,
    options: InMemoryCacheModuleOptions = {},
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.TTL = options.defaultTTL || DEFAULT_TTL

    if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "At the moment this module can only be used with shared resources"
      )
    }
  }

  /**
   * Retrieve data from the cache.
   * @param key - cache key
   */
  async get<T>(key: string): Promise<T | null> {
    const record: CacheRecord<T> | undefined = this.store.get(key)

    if (!record || (record.expire && record.expire < Date.now())) {
      return null
    }

    return record.data
  }

  /**
   * Set data to the cache.
   * @param key - cache key under which the data is stored
   * @param data - data to be stored in the cache
   * @param ttl - expiration time in seconds
   */
  async set<T>(key: string, data: T, ttl: number = this.TTL): Promise<void> {
    const record: CacheRecord<T> = { data, expire: ttl * 1000 + Date.now() }

    const oldRecord = this.store.get(key)

    if (oldRecord?.expire) {
      clearTimeout(this.timoutRefs[key])
      delete this.timoutRefs[key]
    }

    if (record.expire) {
      setTimeout(() => {
        this.invalidate(key)
      }, record.expire)
    }

    this.store.set(key, record)
  }

  /**
   * Delete data from the cache.
   * @param key - cache key
   */
  async invalidate(key: string): Promise<void> {
    if (this.timoutRefs[key]) {
      clearTimeout(this.timoutRefs[key])
      delete this.timoutRefs[key]
    }
    this.store.delete(key)
  }

  /**
   * Delete the entire cache.
   */
  async clear() {
    Object.keys(this.timoutRefs).map((k) => delete this.timoutRefs[k])
    this.store.clear()
  }
}

export default InMemoryCacheService
