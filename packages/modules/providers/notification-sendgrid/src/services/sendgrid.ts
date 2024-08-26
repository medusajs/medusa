import {
  Logger,
  NotificationTypes,
  SendgridNotificationServiceOptions,
} from "@medusajs/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/utils"
import sendgrid from "@sendgrid/mail"

type InjectedDependencies = {
  logger: Logger
}

interface SendgridServiceConfig {
  apiKey: string
  from: string
}

interface Attachment {
  content: string
  filename: string
  type?: string
  disposition?: string
  content_id?: string
}

export class SendgridNotificationService extends AbstractNotificationProviderService {
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

    const attachments = Array.isArray(notification.data?.attachments)
      ? (notification.data.attachments as Attachment[]).map((attachment) => ({
          content: attachment.content, // Base64 encoded string of the file
          filename: attachment.filename,
          type: attachment.type, // MIME type (e.g., 'application/pdf')
          disposition: attachment.disposition ?? "attachment", // Default to 'attachment'
          content_id: attachment.content_id ?? undefined, // Optional: unique identifier for inline attachments
        }))
      : undefined

    const data = notification.data || {}
    const from =
      typeof data.from === "string" && data.from.trim() !== ""
        ? data.from
        : this.config_.from

    const message: sendgrid.MailDataRequired = {
      to: notification.to,
      from: from,
      templateId: notification.template,
      dynamicTemplateData: notification.data as
        | { [key: string]: any }
        | undefined,
      attachments: attachments,
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
