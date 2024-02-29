/**
 * @enum
 *
 * The API key's type.
 */
export enum ApiKeyType {
  /**
   * Publishable key that is tied to eg. a sales channel
   */
  PUBLISHABLE = "publishable",
  /**
   * Secret key that allows access to the admin API
   */
  SECRET = "secret",
}
