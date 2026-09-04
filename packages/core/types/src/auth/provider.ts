import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
} from "./common"

// This interface currently won't allow for linking multiple providers to a single auth entity. That flow is more complex and not supported yet.
/**
 * The service injected into auth providers to manage auth identities and OAuth state.
 */
export interface AuthIdentityProviderService {
  // The provider is injected by the auth identity module
  /**
   * This method retrieves an auth identity by its entity ID.
   *
   * @param {object} selector - The selector used to find the auth identity.
   * @param {string} selector.entity_id - The entity ID of the auth identity.
   * @returns {Promise<AuthIdentityDTO>} The retrieved auth identity.
   */
  retrieve: (selector: { entity_id: string }) => Promise<AuthIdentityDTO>
  /**
   * This method creates a new auth identity.
   *
   * @param {object} data - The data for the auth identity to create.
   * @param {string} data.entity_id - The entity ID of the auth identity.
   * @param {Record<string, unknown>} [data.provider_metadata] - Metadata stored by the provider.
   * @param {Record<string, unknown>} [data.user_metadata] - Metadata about the user.
   * @returns {Promise<AuthIdentityDTO>} The created auth identity.
   */
  create: (data: {
    entity_id: string
    provider_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
  }) => Promise<AuthIdentityDTO>
  /**
   * This method updates an existing auth identity.
   *
   * @param {string} entity_id - The entity ID of the auth identity to update.
   * @param {object} data - The data to update on the auth identity.
   * @param {Record<string, unknown>} [data.provider_metadata] - Updated metadata stored by the provider.
   * @param {Record<string, unknown>} [data.user_metadata] - Updated metadata about the user.
   * @returns {Promise<AuthIdentityDTO>} The updated auth identity.
   */
  update: (
    entity_id: string,
    data: {
      provider_metadata?: Record<string, unknown>
      user_metadata?: Record<string, unknown>
    }
  ) => Promise<AuthIdentityDTO>
  // These methods are used for OAuth providers to store and retrieve state
  /**
   * This method stores a temporary state value for use during OAuth flows.
   *
   * @param {string} key - The key under which to store the state value.
   * @param {Record<string, unknown>} value - The state value to store.
   * @param {number} [ttlSeconds] - The time-to-live in seconds for the stored state.
   * @returns {Promise<void>} Resolves when the state is stored.
   */
  setState: (
    key: string,
    value: Record<string, unknown>,
    ttlSeconds?: number
  ) => Promise<void>
  // Retrieving the state consumes it: the entry is deleted after a successful
  // read so that a state value can only be used once.
  /**
   * This method retrieves and consumes a stored OAuth state value. The entry is deleted after a successful read.
   *
   * @param {string} key - The key of the state value to retrieve.
   * @returns {Promise<Record<string, unknown> | null>} The stored state value, or `null` if not found.
   */
  getState: (key: string) => Promise<Record<string, unknown> | null>
}

/**
 * The interface that all Medusa auth providers must implement.
 */
export interface IAuthProvider {
  /**
   * This method authenticates a user using the provider.
   *
   * @param {AuthenticationInput} data - The authentication input data from the incoming request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service to manage auth identities.
   * @returns {Promise<AuthenticationResponse>} The authentication result.
   */
  authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  /**
   * This method registers a new user using the provider.
   *
   * @param {AuthenticationInput} data - The registration input data from the incoming request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service to manage auth identities.
   * @returns {Promise<AuthenticationResponse>} The registration result.
   */
  register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  /**
   * This method validates the callback from a third-party OAuth provider.
   *
   * @param {AuthenticationInput} data - The callback input data from the incoming request.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service to manage auth identities.
   * @returns {Promise<AuthenticationResponse>} The authentication result after validating the callback.
   */
  validateCallback(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
  /**
   * This method updates an auth identity's data using the provider.
   *
   * @param {Record<string, unknown>} data - The data to update the auth identity with.
   * @param {AuthIdentityProviderService} authIdentityProviderService - The service to manage auth identities.
   * @returns {Promise<AuthenticationResponse>} The update result.
   */
  update(
    data: Record<string, unknown>,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse>
}
