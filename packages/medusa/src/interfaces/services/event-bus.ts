import { StagedJob } from "../../models"
import { TransactionBaseService } from "../transaction-base-service"

export type EventHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IEventBusService extends TransactionBaseService {
  emit<T>(
    eventName: string,
    data: T,
    options?: unknown
  ): Promise<StagedJob | void>

  subscribe<T>(
    eventName: string,
    handler: EventHandler
  ): this | Promise<void | unknown>
}
