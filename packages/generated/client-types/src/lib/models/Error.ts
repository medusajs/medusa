/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface Error {
  /**
   * A slug code to indicate the type of the error.
   */
  code?:
    | "invalid_state_error"
    | "invalid_request_error"
    | "api_error"
    | "unknown_error"
  /**
   * Description of the error that occurred.
   */
  message?: string
  /**
   * A slug indicating the type of the error.
   */
  type?:
    | "QueryRunnerAlreadyReleasedError"
    | "TransactionAlreadyStartedError"
    | "TransactionNotStartedError"
    | "conflict"
    | "unauthorized"
    | "payment_authorization_error"
    | "duplicate_error"
    | "not_allowed"
    | "invalid_data"
    | "not_found"
    | "database_error"
    | "unexpected_state"
    | "invalid_argument"
    | "unknown_error"
}
