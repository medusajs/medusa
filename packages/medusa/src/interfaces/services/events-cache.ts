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

// export abstract class AbstractEventsCacheService
//   implements IEventsCacheService
// {
//   abstract prepare(
//     uniqueId: string,
//     options: Record<string, unknown>
//   ): Promise<void>

//   abstract emit<T>(
//     uniqueId: string,
//     data: T,
//     options: Record<string, unknown>
//   ): Promise<void>

//   abstract commit(
//     uniqueId: string,
//     options: Record<string, unknown>
//   ): Promise<void>

//   abstract invalidate(uniqueId: string): Promise<void>
// }
