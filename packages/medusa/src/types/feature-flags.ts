export interface IFlagRouter {
  isFeatureEnabled: (key: string) => boolean
  listFlags: () => FeatureFlagsResponse
}

/**
 * @schema FeatureFlagsResponse
 * type: array
 * items:
 *   type: object
 *   required:
 *     - key
 *     - value
 *   properties:
 *     key:
 *       description: The key of the feature flag.
 *       type: string
 *     value:
 *       description: The value of the feature flag.
 *       type: boolean
 */
export type FeatureFlagsResponse = {
  key: string
  value: boolean
}[]

export type FlagSettings = {
  key: string
  description: string
  env_key: string
  default_val: boolean
}
