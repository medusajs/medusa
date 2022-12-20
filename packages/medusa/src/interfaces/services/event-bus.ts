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
  ): Promise<void>

  subscribe(eventName: string, handler: EventHandler): this

  processCachedEvents(uniqueId: string, options?: unknown): Promise<void>

  destroyCachedEvents(cacheId: string): Promise<void>
}

export abstract class AbstractEventBusService implements IEventBusService {
  protected abstract cacheService_: CacheService

  abstract emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<void>

  abstract subscribe(eventName: string, handler: EventHandler): this

  abstract processCachedEvents(
    uniqueId: string,
    options: unknown
  ): Promise<void>

  abstract destroyCachedEvents(cacheId: string): Promise<void>
}
