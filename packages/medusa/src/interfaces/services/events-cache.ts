import { EventData } from "../../services/event-bus"

export interface IEventsCacheService {
  prepare(uniqueId: string, options: Record<string, unknown>): Promise<void>

  emit<T>(
    uniqueId: string,
    data: EventData,
    options: Record<string, unknown>
  ): Promise<void>

  commit(uniqueId: string, options: Record<string, unknown>): Promise<void>

  invalidate(uniqueId: string): Promise<void>
}
