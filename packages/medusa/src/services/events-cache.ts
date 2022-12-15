import { IEventsCacheService } from "../interfaces/services/events-cache"
import CacheService from "./cache"
import EventBusService, { EventData } from "./event-bus"

type InjectedDependencies = {
  cacheService: CacheService
  eventBusService: EventBusService
}

export class EventsCacheService implements IEventsCacheService {
  protected readonly cacheService_: CacheService
  protected readonly eventBusService_: EventBusService

  constructor({ cacheService, eventBusService }: InjectedDependencies) {
    this.cacheService_ = cacheService
    this.eventBusService_ = eventBusService
  }

  async prepare(uniqueId: string, options: Record<string, unknown>) {
    // default TTL is 30 sec
    await this.cacheService_.set(uniqueId, options)
  }

  async emit<T>(uniqueId: string, eventData: EventData) {
    const existing = this.cacheService_.get(uniqueId)

    const merged = { ...existing, ...eventData }

    await this.cacheService_.set(uniqueId, merged)
  }

  async emitImmediately<T>(
    eventData: EventData,
    options: Record<string, unknown>
  ) {
    await this.eventBusService_.process(eventData, options)
  }

  async commit(uniqueId: string, options: Record<string, unknown>) {
    const events = await this.cacheService_.get<EventData[]>(uniqueId)
    if (!events) {
      return
    }

    await this.eventBusService_.process(events, options)
  }

  async invalidate(uniqueId: string) {
    await this.cacheService_.invalidate(uniqueId)
  }
}
