import { TransactionBaseService } from "./transaction-base-service"
import BaseNotificationService from "medusa-interfaces/dist/notification-service"

type ReturnedData = {
  to: string
  status: string
  data: Record<string, unknown>
}

export interface INotificationService<T extends TransactionBaseService<never>>
  extends TransactionBaseService<T> {
  sendNotification(
    event: string,
    data: unknown,
    attachmentGenerator: unknown
  ): Promise<ReturnedData>

  resendNotification(
    notification: unknown,
    config: unknown,
    attachmentGenerator: unknown
  ): Promise<ReturnedData>
}

export abstract class AbstractNotificationService<
    T extends TransactionBaseService<never>
  >
  extends TransactionBaseService<T>
  implements INotificationService<T>
{
  static identifier: string

  getIdentifier(): string {
    return (this.constructor as any).identifier
  }

  abstract sendNotification(
    event: string,
    data: unknown,
    attachmentGenerator: unknown
  ): Promise<ReturnedData>

  abstract resendNotification(
    notification: unknown,
    config: unknown,
    attachmentGenerator: unknown
  ): Promise<ReturnedData>
}

export const isNotificationService = (obj: unknown): boolean => {
  return (
    obj instanceof AbstractNotificationService ||
    obj instanceof BaseNotificationService
  )
}
