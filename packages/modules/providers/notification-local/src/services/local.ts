import {
  LocalNotificationServiceOptions,
  Logger,
  NotificationTypes,
} from "@medusajs/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/utils"

type InjectedDependencies = {
  logger: Logger
}

interface LocalServiceConfig {}

const defaultEvents = {
  "order.placed": {
    channels: ["email"],
  },
  "product.created": {
    channels: ["log"],
  },
  "product.updated": {
    channels: ["log"],
  },
}

export class LocalNotificationService extends AbstractNotificationProviderService {
  protected config_: LocalServiceConfig
  protected logger_: Logger
  protected eventsConfig_: any

  constructor(
    { logger }: InjectedDependencies,
    options: LocalNotificationServiceOptions
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
      `Attempting to send a notification to: '${notification.to}'` +
      ` on the channel: '${notification.channel}' with template: '${notification.template}'` +
      ` and data: '${JSON.stringify(notification.data)}'`

    this.logger_.info(message)
    return {}
  }

  getEventsConfig() {
    return {
      ...defaultEvents,
      // @ts-ignore
      ...(this.config_?.events ?? {}),
    }
  }
}
