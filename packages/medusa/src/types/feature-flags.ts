export interface IFlagRouter {
  isFeatureEnabled: (key: string) => boolean
  listFlags: () => FeatureFlagsResponse
}

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
