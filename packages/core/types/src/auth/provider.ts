import {
  AuthIdentityDTO,
  AuthenticationInput,
  AuthenticationResponse,
  CreateAuthIdentityDTO,
} from "./common"

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
