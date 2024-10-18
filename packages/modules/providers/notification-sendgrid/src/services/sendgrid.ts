import {
  Logger,
  NotificationTypes,
  SendgridNotificationServiceOptions,
} from "@medusajs/framework/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import sendgrid from "@sendgrid/mail"

type InjectedDependencies = {
  logger: Logger
}

type MailContent = Required<Omit<NotificationTypes.NotificationContent, "text">>

interface SendgridServiceConfig {
  apiKey: string
  from: string
}

export class SendgridNotificationService extends AbstractNotificationProviderService {
  static identifier = "notification-sendgrid"
  protected config_: SendgridServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: SendgridNotificationServiceOptions
  ) {
    super()

    this.config_ = {
      apiKey: options.api_key,
      from: options.from,
    }
    this.logger_ = logger
    sendgrid.setApiKey(this.config_.apiKey)
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No notification information provided`
      )
    }

    const attachments = Array.isArray(notification.attachments)
      ? notification.attachments.map((attachment) => ({
          content: attachment.content, // Base64 encoded string of the file
          filename: attachment.filename,
          content_type: attachment.content_type, // MIME type (e.g., 'application/pdf')
          disposition: attachment.disposition ?? "attachment", // Default to 'attachment'
          id: attachment.id ?? undefined, // Optional: unique identifier for inline attachments
        }))
      : undefined

    const from = notification.from?.trim() || this.config_.from

    let mailContent:
      | MailContent
      | {
          templateId: string
        }

    if ("content" in notification && !!notification.content) {
      mailContent = {
        subject: notification.content?.subject,
        html: notification.content?.html,
      } as MailContent
    } else {
      // we can't mix html and templates for sendgrid
      mailContent = {
        templateId: notification.template,
      }
    }

    const message: sendgrid.MailDataRequired = {
      to: notification.to,
      from: from,
      dynamicTemplateData: notification.data as
        | { [key: string]: any }
        | undefined,
      attachments: attachments,
      ...mailContent,
    }

    try {
      // Unfortunately we don't get anything useful back in the response
      await sendgrid.send(message)
      return {}
    } catch (error) {
      const errorCode = error.code
      const responseError = error.response?.body?.errors?.[0]
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send email: ${errorCode} - ${
          responseError?.message ?? "unknown error"
        }`
      )
    }
  }
}
