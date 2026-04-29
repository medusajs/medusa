import { Logger, NotificationTypes } from "@medusajs/framework/types"
import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { MedusaCloudEmailOptions } from "@types"

export class MedusaCloudEmailNotificationProvider extends AbstractNotificationProviderService {
  static identifier = "notification-medusa-cloud-email"
  protected options_: MedusaCloudEmailOptions
  protected logger_: Logger

  constructor({}, options: MedusaCloudEmailOptions) {
    super()

    this.options_ = options
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${this.options_.api_key}`,
    }

    if (this.options_.sandbox_handle) {
      headers["x-medusa-sandbox-handle"] = this.options_.sandbox_handle
    }

    if (this.options_.environment_handle) {
      headers["x-medusa-environment-handle"] = this.options_.environment_handle
    }

    try {
      const response = await fetch(`${this.options_.endpoint}/send`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to: notification.to,
          from: notification.from,
          attachments: notification.attachments,
          template: notification.template,
          data: notification.data,
          provider_data: notification.provider_data,
          content: notification.content,
        }),
      })
      const responseBody = await response.json()

      if (!response.ok) {
        throw new Error(
          `Failed to send email: ${response.status} - ${response.statusText}: ${responseBody.message}`
        )
      }

      return { id: responseBody.id }
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }
}
