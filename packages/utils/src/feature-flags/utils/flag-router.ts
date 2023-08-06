import { FeatureFlagTypes } from "@medusajs/types"

export class FlagRouter implements FeatureFlagTypes.IFlagRouter {
  private flags: Record<string, boolean | Record<string, boolean>> = {}

  constructor(flags: Record<string, boolean | Record<string, boolean>>) {
    this.flags = flags
  }

  /**
   * Check if a feature flag is enabled.
   * There are two ways of using this method:
   * 1. `isFeatureEnabled("myFeatureFlag")`
   * 2. `isFeatureEnabled({ myNestedFeatureFlag: "someNestedFlag" })`
   * We use 1. for top-level feature flags and 2. for nested feature flags. Almost all flags are top-level.
   * An example of a nested flag is workflows. To use it, you would do:
   * `isFeatureEnabled({ workflows: Workflows.CreateCart })`
   * @constructor
   */
  public isFeatureEnabled(key: string | Record<string, string>): boolean {
    if (typeof key === `string`) {
      return !!this.flags[key]
    }

    const [nestedFlag, flag] = Object.entries(key)[0]

    return !!this.flags[nestedFlag]?.[flag]
  }

  public setFlag(
    key: string,
    value: boolean | { [key: string]: boolean }
  ): void {
    if (typeof value === `object`) {
      const existing = this.flags[key]

      if (!existing) {
        this.flags[key] = value
        return
      }

      this.flags[key] = { ...(this.flags[key] as object), ...value }
      return
    }

    this.flags[key] = value
  }

  public listFlags(): FeatureFlagTypes.FeatureFlagsResponse {
    return Object.entries(this.flags || {}).map(([key, value]) => ({
      key,
      value,
    }))
  }
}
