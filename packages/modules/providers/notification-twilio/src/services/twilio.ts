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

interface TwilioServiceConfig {
  accountSid: string
  authToken: string
  from?: string
  messagingServiceSid?: string
}

export class TwilioNotificationService extends AbstractNotificationProviderService {
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
   * Sends a notification via Twilio SMS (or MMS if attachments are provided)
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
    const data = notification.data || {}
    const body = data.body as string
    const mediaUrls = data.mediaUrls as string[]
    const messagingServiceSid = data.messagingServiceSid as string

    const { to, from } = notification

    if (!to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Recipient to (#) is required"
      )
    }

    if (!body) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Message body is required`
      )
    }

    const fromNumber = from?.trim() || this.config_.from
    const messagingService =
      messagingServiceSid?.trim() || this.config_.messagingServiceSid

    if (!fromNumber && !messagingService) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Either 'from' number or 'messagingServiceSid' must be provided`
      )
    }
    const smsData = {
      to: to,
      body: body,
      from: fromNumber || undefined,
      messagingServiceSid: messagingService || undefined,
      mediaUrl: mediaUrls && mediaUrls.length > 0 ? mediaUrls : undefined,
    }

    try {
      const message = await this.client_.messages.create(smsData)
      this.logger_.info(`Message sent: SID ${message.sid}`)
      return { id: message.sid }
    } catch (error: any) {
      const errorCode = error.code || "UNKNOWN_ERROR"
      const errorMessage = error.message || "An unknown error occurred"

      this.logger_.error(`Failed to send SMS: ${error}`)
      this.logger_.error(`Failed to send SMS: ${errorCode} - ${errorMessage}`)

      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send SMS: ${errorCode} - ${errorMessage}`
      )
    }
  }
}
