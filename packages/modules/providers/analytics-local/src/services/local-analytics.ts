import {
  LocalAnalyticsServiceOptions,
  Logger,
  ProviderIdentifyAnalyticsEventDTO,
  ProviderTrackAnalyticsEventDTO,
} from "@zjedene-medusa/framework/types"
import { AbstractAnalyticsProviderService } from "@zjedene-medusa/framework/utils"

type InjectedDependencies = {
  logger: Logger
}

export class LocalAnalyticsService extends AbstractAnalyticsProviderService {
  static identifier = "analytics-local"
  protected config_: LocalAnalyticsServiceOptions
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: LocalAnalyticsServiceOptions
  ) {
    super()
    this.config_ = options
    this.logger_ = logger
  }

  async track(data: ProviderTrackAnalyticsEventDTO): Promise<void> {
    this.logger_.debug(
      `Tracking event: '${data.event}', actor_id: '${
        data.actor_id ?? "-"
      }', group: '${data.group?.id ?? "-"}', properties: '${JSON.stringify(
        data.properties
      )}'`
    )
  }

  async identify(data: ProviderIdentifyAnalyticsEventDTO): Promise<void> {
    this.logger_.debug(
      `Identifying user: '${data.actor_id ?? "-"}', group: '${
        "group" in data ? data.group.id : "-"
      }', properties: '${JSON.stringify(data.properties)}'`
    )
  }
}
