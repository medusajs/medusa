import { NotificationTypes } from "@medusajs/framework/types"
import { AbstractNotificationProviderService } from "@medusajs/framework/utils"

export class NotificationProviderServiceFixtures extends AbstractNotificationProviderService {
  static identifier = "fixtures-notification-provider"

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (notification.to === "fail") {
      throw new Error("Failed to send notification")
    }
    return { id: "external_id" }
  }
}

export const services = [NotificationProviderServiceFixtures]
