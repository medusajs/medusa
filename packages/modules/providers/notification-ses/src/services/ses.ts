import {
  Logger,
  NotificationTypes,
  SesNotificationServiceOptions,
} from "@medusajs/framework/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  EmailContent,
  SESv2Client,
  SendEmailCommand,
} from "@aws-sdk/client-sesv2"

type InjectedDependencies = {
  logger: Logger
}

/**
 * `provider_data` values are passed through from the caller, so they are
 * validated before they reach the AWS SDK.
 */
function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return
  }

  const isStringArray = value.every((item) => typeof item === "string")

  return isStringArray ? (value as string[]) : undefined
}

export class SesNotificationService extends AbstractNotificationProviderService {
  static identifier = "notification-ses"

  protected config_: SesNotificationServiceOptions
  protected client_: SESv2Client
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: SesNotificationServiceOptions
  ) {
    super()

    this.config_ = {
      from: options.from,
      region: options.region,
      configuration_set_name: options.configuration_set_name,
      reply_to_addresses: options.reply_to_addresses,
      credentials: options.credentials,
    }
    this.logger_ = logger

    const credentials = this.config_.credentials

    this.client_ = new SESv2Client({
      region: this.config_.region,
      credentials: credentials
        ? {
            accessKeyId: credentials.access_key_id,
            secretAccessKey: credentials.secret_access_key,
            sessionToken: credentials.session_token,
          }
        : undefined,
    })
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

    if (notification.attachments?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The SES notification provider doesn't support attachments`
      )
    }

    const from = notification.from?.trim() || this.config_.from
    const providerData = notification.provider_data ?? {}
    const ccAddresses = toStringArray(providerData.cc)
    const bccAddresses = toStringArray(providerData.bcc)

    let content: EmailContent

    if (notification.content) {
      const { subject, html, text } = notification.content

      if (!subject) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The notification content requires a subject`
        )
      }

      content = {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            ...(html ? { Html: { Data: html, Charset: "UTF-8" } } : {}),
            ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
          },
        },
      }
    } else {
      content = {
        Template: {
          TemplateName: notification.template,
          TemplateData: JSON.stringify(notification.data ?? {}),
        },
      }
    }

    try {
      const response = await this.client_.send(
        new SendEmailCommand({
          FromEmailAddress: from,
          Destination: {
            ToAddresses: [notification.to],
            ...(ccAddresses ? { CcAddresses: ccAddresses } : {}),
            ...(bccAddresses ? { BccAddresses: bccAddresses } : {}),
          },
          ReplyToAddresses: this.config_.reply_to_addresses,
          ConfigurationSetName: this.config_.configuration_set_name,
          Content: content,
        })
      )

      return { id: response.MessageId }
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send email: ${error.name} - ${error.message}`
      )
    }
  }
}
