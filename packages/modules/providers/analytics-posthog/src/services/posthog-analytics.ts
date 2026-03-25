import {
  Logger,
  PosthogAnalyticsServiceOptions,
  ProviderIdentifyAnalyticsEventDTO,
  ProviderTrackAnalyticsEventDTO,
} from "@medusajs/framework/types"
import { AbstractAnalyticsProviderService } from "@medusajs/framework/utils"
import { PostHog } from "posthog-node"

type InjectedDependencies = {
  logger: Logger
}

export class PosthogAnalyticsService extends AbstractAnalyticsProviderService {
  static identifier = "analytics-posthog"
  protected config_: PosthogAnalyticsServiceOptions
  protected logger_: Logger
  protected client_: PostHog

  constructor(
    { logger }: InjectedDependencies,
    options: PosthogAnalyticsServiceOptions
  ) {
    super()
    this.config_ = options
    this.logger_ = logger

    if (!options.posthogEventsKey) {
      throw new Error("Posthog API key is not set, but is required")
    }

    this.client_ = new PostHog(options.posthogEventsKey, {
      host: options.posthogHost || "https://eu.i.posthog.com",
    })
  }

  async track(data: ProviderTrackAnalyticsEventDTO): Promise<void> {
    if (!data.event) {
      throw new Error(
        "Event name is required when tracking an event with Posthog"
      )
    }

    if (!data.actor_id) {
      throw new Error(
        "Actor ID is required when tracking an event with Posthog"
      )
    }

    if (data.group?.id && !data.group?.type) {
      throw new Error(
        "Group type is required if passing group id when tracking an event with Posthog"
      )
    }

    this.client_.capture({
      event: data.event,
      distinctId: data.actor_id,
      properties: data.properties,
      groups: data.group?.id
        ? { [data.group.type!]: data.group.id }
        : undefined,
    })
  }

  async identify(data: ProviderIdentifyAnalyticsEventDTO): Promise<void> {
    if ("group" in data) {
      this.client_.groupIdentify({
        groupKey: data.group.id!,
        groupType: data.group.type!,
        properties: data.properties,
        distinctId: data.actor_id,
      })
    } else if (data.actor_id) {
      this.client_.identify({
        distinctId: data.actor_id,
        properties: data.properties,
      })
    } else {
      throw new Error(
        "Actor or group is required when identifying an entity with Posthog"
      )
    }
  }

  async shutdown() {
    await this.client_.shutdown()
  }
}
