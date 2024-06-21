import { NotificationTypes } from "@medusajs/types"
import { AbstractNotificationProviderService } from "@medusajs/utils"

export class NotificationProviderServiceFixtures extends AbstractNotificationProviderService {
  static identifier = "fixtures-notification-provider"

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    return { id: "external_id" }
  }
}

export const services = [NotificationProviderServiceFixtures]
