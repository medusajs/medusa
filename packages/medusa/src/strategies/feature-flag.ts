import { ConfigModule } from "../types/global"

type InjectedDependencies = {
  configModule: ConfigModule
}

class FeatureFlagStrategy {
  private current_: Map<string, boolean>

  constructor({ configModule }: InjectedDependencies) {
    this.current_ = new Map(
      Object.entries(configModule.featureFlags).map(([k, v]) => [k, !!v])
    )
  }

  isSet(flagname: string): boolean {
    return !!(this.current_.has(flagname) && this.current_.get(flagname))
  }
}

export default FeatureFlagStrategy
