import { NotificationTypes, INotificationProvider } from "@medusajs/types"

export class AbstractNotificationProviderService
  implements INotificationProvider
{
  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    throw Error("send must be overridden by the child class")
  }
}
