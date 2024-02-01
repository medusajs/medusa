import { FeatureFlagTypes } from "@medusajs/types"
import { isObject, isString } from "../../common"

export class FlagRouter implements FeatureFlagTypes.IFlagRouter {
  private readonly flags: Record<string, boolean | Record<string, boolean>> = {}

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
   * @param flag - The flag to check
   * @return {boolean} - Whether the flag is enabled or not
   */
  public isFeatureEnabled(
    flag: string | string[] | Record<string, string>
  ): boolean {
    if (isObject(flag)) {
      const [nestedFlag, value] = Object.entries(flag)[0]
      if (typeof this.flags[nestedFlag] === "boolean") {
        return this.flags[nestedFlag] as boolean
      }
      return !!this.flags[nestedFlag]?.[value]
    }

    const flags = (Array.isArray(flag) ? flag : [flag]) as string[]
    return flags.every((flag_) => {
      if (!isString(flag_)) {
        throw Error("Flag must be a string an array of string or an object")
      }
      return !!this.flags[flag_]
    })
  }

  /**
   * Sets a feature flag.
   * Flags take two shapes:
   * `setFlag("myFeatureFlag", true)`
   * `setFlag("myFeatureFlag", { nestedFlag: true })`
   * These shapes are used for top-level and nested flags respectively, as explained in isFeatureEnabled.
   * @param key - The key of the flag to set.
   * @param value - The value of the flag to set.
   * @return {void} - void
   */
  public setFlag(
    key: string,
    value: boolean | { [key: string]: boolean }
  ): void {
    if (isObject(value)) {
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
