export interface IFlagRouter {
  isFeatureEnabled: (key: string) => boolean
}

export type FlagSettings = {
  key: string
  description: string
  env_key: string
  default_val: boolean
}
