import { NotificationTypes, INotificationProvider } from "@medusajs/types"

export class AbstractNotificationProviderService
  implements INotificationProvider
{
  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    throw Error(
      `send is not implemented in ${
        Object.getPrototypeOf(this).constructor.name
      }`
    )
  }
}
