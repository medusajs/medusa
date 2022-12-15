import { TransactionBaseService } from "../transaction-base-service"

export type BackgroundJobHandler<T = unknown> = (
  data: T,
  eventName: string
) => Promise<void>

export interface IBackgroundJobService extends TransactionBaseService {
  create<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown> | any,
    handler: BackgroundJobHandler
  ): Promise<void | unknown> | void
}

export abstract class AbstractBackgroundJobService
  extends TransactionBaseService
  implements IBackgroundJobService
{
  protected constructor(container: unknown, config?: Record<string, unknown>) {
    super(container, config)
  }

  public abstract create<T>(
    eventName: string,
    data: T,
    options: Record<string, unknown> | any,
    handler: BackgroundJobHandler
  ): Promise<void | unknown> | void
}
