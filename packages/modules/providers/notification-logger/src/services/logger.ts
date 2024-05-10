import {
  Logger,
  NotificationTypes,
  LoggerNotificationServiceOptions,
} from "@medusajs/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/utils"

type InjectedDependencies = {
  logger: Logger
}

interface LoggerServiceConfig {}

export class LoggerNotificationService extends AbstractNotificationProviderService {
  protected config_: LoggerServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: LoggerNotificationServiceOptions
  ) {
    super()
    this.config_ = options
    this.logger_ = logger
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

    const message =
      `Attempting to send a notification to: ${notification.to}` +
      ` on the channel: ${notification.channel} with template: ${notification.template}` +
      ` and data: ${JSON.stringify(notification.data)}`

    this.logger_.info(message)
    return {}
  }
}
