export interface IFlagRouter {
  featureIsEnabled: (key: string) => boolean
}

export type FlagSettings = {
  key: string
  description: string
  env_key: string
  default_val: boolean
}
