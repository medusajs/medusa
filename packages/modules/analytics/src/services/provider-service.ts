import { MedusaError } from "@medusajs/framework/utils"
import {
  Constructor,
  IAnalyticsProvider,
  ProviderIdentifyAnalyticsEventDTO,
  ProviderTrackAnalyticsEventDTO,
} from "@medusajs/types"

export const AnalyticsProviderIdentifierRegistrationName =
  "analytics_providers_identifier"

export const AnalyticsProviderRegistrationPrefix = "aly_"

type InjectedDependencies = {
  [
    key: `${typeof AnalyticsProviderRegistrationPrefix}${string}`
  ]: IAnalyticsProvider
}

export default class AnalyticsProviderService {
  protected readonly analyticsProvider_: IAnalyticsProvider

  constructor(container: InjectedDependencies) {
    const analyticsProviderKeys = Object.keys(container).filter((k) =>
      k.startsWith(AnalyticsProviderRegistrationPrefix)
    )

    if (analyticsProviderKeys.length !== 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Analytics module should be initialized with exactly one provider`
      )
    }

    this.analyticsProvider_ = container[analyticsProviderKeys[0]]
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<IAnalyticsProvider>,
    optionName?: string
  ) {
    return `${(providerClass as any).identifier}_${optionName}`
  }

  async track(data: ProviderTrackAnalyticsEventDTO): Promise<void> {
    await this.analyticsProvider_.track(data)
  }

  async identify(data: ProviderIdentifyAnalyticsEventDTO): Promise<void> {
    await this.analyticsProvider_.identify(data)
  }

  async shutdown(): Promise<void> {
    await this.analyticsProvider_.shutdown?.()
  }
}
