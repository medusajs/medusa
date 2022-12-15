import { TransactionBaseService } from "../transaction-base-service"

export type CronHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface ICronJobService extends TransactionBaseService {
  create<T>(
    eventName: string,
    data: T,
    cronSchedule: string,
    options: Record<string, unknown>,
    handler: CronHandler
  ): Promise<void | unknown>
}

export abstract class AbstractCronJobService
  extends TransactionBaseService
  implements ICronJobService
{
  protected constructor(container: unknown, config?: Record<string, unknown>) {
    super(container, config)
  }

  public abstract create<T>(
    eventName: string,
    data: T,
    cronSchedule: string,
    options: Record<string, unknown>,
    handler: CronHandler
  ): Promise<void | unknown>

  protected abstract registerCronHandler(
    eventName: string,
    handler: CronHandler
  ): this
}
