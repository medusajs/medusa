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

    const message = {
      to: notification.to,
      from: this.config_.from,
      templateId: notification.template,
      dynamicTemplateData: notification.data as
        | { [key: string]: any }
        | undefined,
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
