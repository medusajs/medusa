import type {
  Event,
  ICachingModuleService,
  ICachingStrategy,
  Logger,
  ModuleJoinerConfig,
} from "@medusajs/framework/types"
import {
  type GraphQLSchema,
  Modules,
  toCamelCase,
  upperCaseFirst,
} from "@medusajs/framework/utils"
import { type CachingModuleService } from "@services"
import type { InjectedDependencies } from "@types"
import stringify from "fast-json-stable-stringify"
import {
  CacheInvalidationParser,
  EntityReference,
  InvalidationOperation,
} from "./parser"

/**
 * Upper bound on the number of tags handed to a single clear. Providers resolve
 * the cached keys of every tag before deleting them, so an unbounded batch
 * would materialise as many buffers as there are cached entries behind it.
 */
const MAX_TAGS_PER_INVALIDATION = 100

export class DefaultCacheStrategy implements ICachingStrategy {
  #cacheInvalidationParser: CacheInvalidationParser
  #cacheModule: ICachingModuleService
  #container: InjectedDependencies
  #hasher: (data: string) => string
  #logger: Logger

  /**
   * Tags waiting to be invalidated. A burst of writes emits thousands of events
   * whose tags are almost entirely duplicates, so they are deduplicated here and
   * drained in bounded batches instead of issuing one clear per event.
   */
  #pendingTags: Set<string> = new Set()
  #pendingFlush: Promise<void> | null = null

  constructor(
    container: InjectedDependencies,
    cacheModule: CachingModuleService
  ) {
    this.#cacheModule = cacheModule
    this.#container = container
    this.#hasher = container.hasher
    this.#logger = container.logger ?? (console as unknown as Logger)
  }

  objectHash(input: any): string {
    const str = stringify(input)
    return this.#hasher(str)
  }

  async onApplicationStart(
    schema: GraphQLSchema,
    joinerConfigs: ModuleJoinerConfig[]
  ) {
    this.#cacheInvalidationParser = new CacheInvalidationParser(
      schema,
      joinerConfigs
    )

    const eventBus = this.#container[Modules.EVENT_BUS]

    const handleEvent = async (data: Event) => {
      const tags = await this.#computeEventTags(data)

      if (!tags.length) {
        return
      }

      await this.#invalidateTags(tags)
    }

    // Only subscribe. Registering the same handler as an interceptor would run
    // the invalidation in whichever process emits the event, including a
    // `worker_mode: "server"` process that is documented as not processing
    // events, and would invalidate every event twice in a server/worker split
    // since events with a matching subscriber are queued regardless.
    eventBus.subscribe("*", handleEvent)
  }

  async computeKey(input: object) {
    return this.objectHash(input)
  }

  async computeTags(
    input: object,
    options?: {
      entities?: EntityReference[]
      operation?: InvalidationOperation
    }
  ): Promise<string[]> {
    // Parse the input object to identify entities
    const entities_ =
      options?.entities ||
      this.#cacheInvalidationParser.parseObjectForEntities(input)

    if (entities_.length === 0) {
      return []
    }

    // Build invalidation events to get comprehensive cache keys
    const events = this.#cacheInvalidationParser.buildInvalidationEvents(
      entities_,
      options?.operation
    )

    // Collect all unique cache keys from all events as tags
    const tags = new Set<string>()

    events.forEach((event) => {
      event.cacheKeys.forEach((key) => tags.add(key))
    })

    return Array.from(tags)
  }

  async #computeEventTags(data: Event): Promise<string[]> {
    const eventName = data.name
    const operation = eventName.split(".").pop() as InvalidationOperation
    const entityType = eventName.split(".").slice(-2).shift()!

    const eventData = data.data as
      | { id: string | string[] }
      | { id: string | string[] }[]

    const normalizedEventData = Array.isArray(eventData)
      ? eventData
      : [eventData]

    const tags: string[] = []
    for (const item of normalizedEventData) {
      const ids = Array.isArray(item.id) ? item.id : [item.id]

      for (const id of ids) {
        const entityReference: EntityReference = {
          type: upperCaseFirst(toCamelCase(entityType)),
          id,
        }

        const tags_ = await this.computeTags(item, {
          entities: [entityReference],
          operation,
        })
        tags.push(...tags_)
      }
    }

    return tags
  }

  /**
   * Queues the tags for invalidation and resolves once they have been cleared.
   *
   * Awaiting the in-flight flush is what applies backpressure: while a clear is
   * running, concurrent events add their tags to the pending set and wait for it
   * rather than starting clears of their own.
   */
  async #invalidateTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      this.#pendingTags.add(tag)
    }

    this.#pendingFlush ??= this.#flushPendingTags()

    await this.#pendingFlush
  }

  async #flushPendingTags(): Promise<void> {
    try {
      // Let the events emitted within the same tick join this batch.
      await new Promise<void>((resolve) => setImmediate(resolve))

      while (this.#pendingTags.size) {
        const batch: string[] = []

        for (const tag of this.#pendingTags) {
          if (batch.length >= MAX_TAGS_PER_INVALIDATION) {
            break
          }
          batch.push(tag)
        }

        for (const tag of batch) {
          this.#pendingTags.delete(tag)
        }

        try {
          await this.#cacheModule.clear({
            tags: batch,
            options: { autoInvalidate: true },
          })
        } catch (error) {
          // An invalidation that throws leaves stale entries behind, but it must
          // not prevent the remaining tags from being cleared.
          this.#logger.error(
            `[caching-module]: Failed to invalidate cache tags: ${error.message}\n${error.stack}`
          )
        }
      }
    } finally {
      // Reset synchronously with the loop exiting, so that a caller queueing
      // tags right after cannot attach to a flush that is already done.
      this.#pendingFlush = null
    }
  }
}
