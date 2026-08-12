import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
} from "./common"

// This interface currently won't allow for linking multiple providers to a single auth entity. That flow is more complex and not supported yet.
export interface AuthIdentityProviderService {
  // The provider is injected by the auth identity module
  retrieve: (selector: { entity_id: string }) => Promise<AuthIdentityDTO>
  create: (data: {
    entity_id: string
    provider_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
  }) => Promise<AuthIdentityDTO>
  update: (
    entity_id: string,
    data: {
      provider_metadata?: Record<string, unknown>
      user_metadata?: Record<string, unknown>
    }
  ) => Promise<AuthIdentityDTO>
  // These methods are used for OAuth providers to store and retrieve state
  setState: (
    key: string,
    value: Record<string, unknown>,
    ttlSeconds?: number
  ) => Promise<void>
  // Retrieving the state consumes it: the entry is deleted after a successful
  // read so that a state value can only be used once.
  getState: (key: string) => Promise<Record<string, unknown> | null>
}

export interface IAuthProvider {
  authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  update(
    data: Record<string, unknown>,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
}
