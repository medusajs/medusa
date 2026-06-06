import {
  ProviderIdentifyAnalyticsEventDTO,
  ProviderTrackAnalyticsEventDTO,
} from "@zjedene-medusa/framework/types"
import { AbstractAnalyticsProviderService } from "@zjedene-medusa/framework/utils"

export class AnalyticsProviderServiceFixtures extends AbstractAnalyticsProviderService {
  static identifier = "fixtures-analytics-provider"

  async track(data: ProviderTrackAnalyticsEventDTO): Promise<void> {
    return Promise.resolve()
  }

  async identify(data: ProviderIdentifyAnalyticsEventDTO): Promise<void> {
    return Promise.resolve()
  }

  async shutdown(): Promise<void> {
    return Promise.resolve()
  }
}

export const services = [AnalyticsProviderServiceFixtures]
