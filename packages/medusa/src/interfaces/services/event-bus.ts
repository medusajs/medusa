import { CacheService } from "../../services"

export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IEventBusService {
  emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<void | unknown>

  subscribe<T>(
    eventName: string,
    handler: EventHandler
  ): this | Promise<void | unknown>

  prepareEventsCache(uniqueId: string): void

  processCachedEvents<T>(uniqueId: string, options: unknown): void

  bustEventsCache(cacheId: string): void
}

export abstract class AbstractEventBusService implements IEventBusService {
  protected abstract cacheService_: CacheService

  abstract emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<void | unknown>

  abstract subscribe<T>(
    eventName: string,
    handler: EventHandler
  ): this | Promise<void | unknown>

  abstract prepareEventsCache(uniqueId: string): void

  abstract processCachedEvents<T>(uniqueId: string, options: unknown): void

  abstract bustEventsCache(cacheId: string): void
}
