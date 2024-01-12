import { TransactionBaseService } from "./transaction-base-service"

type ReturnedData = {
  to: string
  status: string
  data: Record<string, unknown>
}

export interface INotificationService extends TransactionBaseService {
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

export abstract class AbstractNotificationService
  extends TransactionBaseService
  implements INotificationService
{
  static _isNotificationService = true
  static identifier: string

  static isNotificationService(object): boolean {
    return object?.constructor?._isNotificationService
  }

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
