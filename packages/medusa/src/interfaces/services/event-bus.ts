export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IEventBusService {
  emit<T>(eventName: string, data: T, options?: Record<string, unknown>): void
  subscribe<T>(eventName: string, handler: EventHandler): void
}
