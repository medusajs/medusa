export interface IEventBusService {
  emit(event: string, data: any): Promise<void>
  publish<T>(eventName: string, data: T, options: Record<string, unknown>): void
  subscribe<T>(eventName: string, handler: (data: T) => void): void
}
