import {
  Logger,
  NotificationTypes,
  TwilioNotificationServiceOptions,
} from "@medusajs/framework/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import Twilio from "twilio"

type InjectedDependencies = {
  logger: Logger
}

type SmsContent = Required<
  Omit<NotificationTypes.NotificationContent, "subject" | "html">
>

interface TwilioServiceConfig {
  accountSid: string
  authToken: string
  from?: string
  messagingServiceSid?: string
}

export class TwilioNotificationService extends AbstractNotificationProviderService {
  static identifier = "notification-twilio"
  protected config_: TwilioServiceConfig
  protected logger_: Logger
  protected client_: Twilio.Twilio

  constructor(
    { logger }: InjectedDependencies,
    options: TwilioNotificationServiceOptions
  ) {
    super()

    this.config_ = {
      accountSid: options.account_sid,
      authToken: options.auth_token,
      from: options.from,
      messagingServiceSid: options.messaging_service_sid,
    }
    this.logger_ = logger
    this.client_ = Twilio(this.config_.accountSid, this.config_.authToken)
  }
  /**
   * Sends a notification via Twilio SMS (or MMS if mediaUrls are provided)
   * @param notification the notification data
   * @returns a promise that resolves when the message is sent
   */

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No notification information provided"
      )
    }
    const content = notification.content as SmsContent

    if (!content?.text) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Message body (content.text) is required for SMS`
      )
    }

    const mediaUrls = notification.data?.mediaUrls as string[] | undefined
    const fromNumber = notification.from?.trim() || this.config_.from
    const messagingService =
      (notification.data?.messagingServiceSid as string) ||
      this.config_.messagingServiceSid

    if (!notification.to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Recipient to (#) is required"
      )
    }

    if (!fromNumber && !messagingService) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Either 'from' number or 'messagingServiceSid' must be provided`
      )
    }
    const smsData = {
      to: notification.to,
      body: content.text,
      from: fromNumber || undefined,
      messagingServiceSid: messagingService || undefined,
      mediaUrl: mediaUrls && mediaUrls.length > 0 ? mediaUrls : undefined,
    }

    try {
      const message = await this.client_.messages.create(smsData)
      const messageBody =
        typeof message.body === "string"
          ? JSON.parse(message.body)
          : message.body
      if (messageBody.error_code) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to send SMS: ${messageBody.error_code} - ${messageBody.error_message}`
        )
      }

      return { id: message.sid }
    } catch (error: any) {
      const errorCode = error.code
      const responseError = error.response?.body?.errors?.[0]
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send SMS: ${errorCode} - ${
          responseError?.message ?? "unknown error"
        }`
      )
    }
  }
}
