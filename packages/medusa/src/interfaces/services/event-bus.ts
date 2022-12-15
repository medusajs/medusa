import { TransactionBaseService } from "../transaction-base-service"

export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IEventBusService extends TransactionBaseService {
  emit<T>(
    eventName: string,
    data: T,
    options?: Record<string, unknown>
  ): Promise<void | unknown>

  subscribe<T>(
    eventName: string,
    handler: EventHandler
  ): this | Promise<void | unknown>
}
