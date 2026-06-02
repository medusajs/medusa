export interface EmailPassAuthProviderOptions {
  hashConfig?: {
    logN: number
    r: number
    p: number
  }
  require_verification?: boolean
  require_verification_actor_types?: string[]
}
