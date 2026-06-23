import type {
  Event,
  ICachingModuleService,
  ICachingStrategy,
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
import { CacheInvalidationParser, EntityReference } from "./parser"

export class DefaultCacheStrategy implements ICachingStrategy {
  #cacheInvalidationParser: CacheInvalidationParser
  #cacheModule: ICachingModuleService
  #container: InjectedDependencies
  #hasher: (data: string) => string

  constructor(
    container: InjectedDependencies,
    cacheModule: CachingModuleService
  ) {
    this.#cacheModule = cacheModule
    this.#container = container
    this.#hasher = container.hasher
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
      try {
        // We dont have to await anything here and the rest can be done in the background
        return
      } finally {
        const eventName = data.name
        const operation = eventName.split(".").pop() as
          | "created"
          | "updated"
          | "deleted"
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

        await this.#cacheModule.clear({
          tags,
          options: { autoInvalidate: true },
        })
      }
    }

    eventBus.subscribe("*", handleEvent)
    eventBus.addInterceptor?.(handleEvent)
  }

  async computeKey(input: object) {
    return this.objectHash(input)
  }

  async computeTags(
    input: object,
    options?: {
      entities?: EntityReference[]
      operation?: "created" | "updated" | "deleted"
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
}
