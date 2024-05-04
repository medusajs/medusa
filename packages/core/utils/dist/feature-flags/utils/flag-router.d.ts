import { FeatureFlagTypes } from "@medusajs/types";
export declare class FlagRouter implements FeatureFlagTypes.IFlagRouter {
    private readonly flags;
    constructor(flags: Record<string, boolean | Record<string, boolean>>);
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
    isFeatureEnabled(flag: string | string[] | Record<string, string>): boolean;
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
    setFlag(key: string, value: boolean | {
        [key: string]: boolean;
    }): void;
    listFlags(): FeatureFlagTypes.FeatureFlagsResponse;
}
