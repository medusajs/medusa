import {
  ApiKeyType,
  IEventBusModuleService,
  Logger,
  RevokeApiKeyDTO,
  UpdateApiKeyDTO,
} from "@medusajs/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}

/**
 * Data transfer object for creating a new API key.
 * 
 * This type defines the complete structure needed to store an API key
 * in the database, including security-related fields like the hashed
 * token and salt for secret keys.
 * 
 * @example
 * ```typescript
 * const createData: CreateApiKeyDTO = {
 *   token: "hashed_token_value",
 *   salt: "random_salt",
 *   redacted: "sk_abc***123",
 *   title: "My Secret Key",
 *   type: ApiKeyType.SECRET,
 *   created_by: "user_123"
 * }
 * ```
 */
export type CreateApiKeyDTO = {
  /** The hashed token value (for secret keys) or raw token (for publishable keys) */
  token: string
  /** The salt used for hashing secret keys (empty string for publishable keys) */
  salt: string
  /** The redacted version of the token for display purposes (e.g., "sk_abc***123") */
  redacted: string
  /** Human-readable title for the API key */
  title: string
  /** The type of API key (secret or publishable) */
  type: ApiKeyType
  /** ID of the user who created this API key */
  created_by: string
}

/**
 * Data transfer object containing token information for API key generation.
 * 
 * This type holds both the raw token (visible to the user only during creation)
 * and the processed versions needed for secure storage and display.
 * 
 * @example
 * ```typescript
 * const tokenData: TokenDTO = {
 *   rawToken: "sk_1234567890abcdef...",
 *   hashedToken: "a1b2c3d4e5f6...",
 *   salt: "randomsalt123",
 *   redacted: "sk_123***def"
 * }
 * ```
 */
export type TokenDTO = {
  /** The original, unhashed token string that users see only during creation */
  rawToken: string
  /** The hashed version of the token stored securely in the database */
  hashedToken: string
  /** The cryptographic salt used for hashing (empty for publishable keys) */
  salt: string
  /** The redacted version shown in UIs for identification */
  redacted: string
}

export type UpdateApiKeyInput = UpdateApiKeyDTO & { id: string }
export type RevokeApiKeyInput = RevokeApiKeyDTO & { id: string }
