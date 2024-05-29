import {
  AuthIdentityDTO,
  AuthenticationInput,
  AuthenticationResponse,
  CreateAuthIdentityDTO,
} from "./common"

// This interface currently won't allow for linking multiple providers to a single auth entity. That flow is more complex and not supported yet.
export interface AuthIdentityProviderService {
  // The provider is injected by the auth identity module
  retrieve: (selector: {
    entity_id: string
    provider: string
  }) => Promise<AuthIdentityDTO>
  create: (data: CreateAuthIdentityDTO) => Promise<AuthIdentityDTO>
}

/**
 * ## Overview
 *
 * Authentication provider interface for the auth module.
 *
 */
export interface IAuthProvider {
  authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
}
