import { FeatureFlagTypes } from "@medusajs/types"

export class FlagRouter implements FeatureFlagTypes.IFlagRouter {
  private readonly flags: Record<string, boolean> = {}

  constructor(flags: Record<string, boolean>) {
    this.flags = flags
  }

  public isFeatureEnabled(key: string): boolean {
    return !!this.flags[key]
  }

  public setFlag(key: string, value = true): void {
    this.flags[key] = value
  }

  public listFlags(): FeatureFlagTypes.FeatureFlagsResponse {
    return Object.entries(this.flags || {}).map(([key, value]) => ({
      key,
      value,
    }))
  }
}
