/**
 * Represents the additional_data property accepted in HTTP
 * requests to allow arbitrary values
 */
export type AdditionalData = {
  additional_data?: Record<string, unknown>
}
