/**
 * @typedef MedusaErrorType
 *
 */
export const MedusaErrorTypes = {
  /** Errors stemming from the database */
  DB_ERROR: "database_error",
  DUPLICATE_ERROR: "duplicate_error",
  INVALID_ARGUMENT: "invalid_argument",
  INVALID_DATA: "invalid_data",
  NOT_FOUND: "not_found",
  NOT_ALLOWED: "not_allowed",
}

export const MedusaErrorCodes = {
  INSUFFICIENT_INVENTORY: "insufficient_inventory",
  CART_INCOMPATIBLE_STATE: "cart_incompatible_state",
}

/**
 * Standardized error to be used across Medusa project.
 * @extends Error
 */
class MedusaError extends Error {
  /**
   * Creates a standardized error to be used across Medusa project.
   * @param type {MedusaErrorType} - the type of error.
   * @param params {Array} - Error params.
   */
  constructor(type, message, code, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MedusaError)
    }

    this.type = type
    this.name = type
    this.code = code
    this.message = message
    this.date = new Date()
  }
}

MedusaError.Types = MedusaErrorTypes
MedusaError.Codes = MedusaErrorCodes

export default MedusaError
