export interface IEventBusService {
  emit(event: string, data: any): Promise<void>
}
