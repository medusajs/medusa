/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Idempotency Key is used to continue a process in case of any failure that might occur.
 */
export interface IdempotencyKey {
  /**
   * The idempotency key's ID
   */
  id: string
  /**
   * The unique randomly generated key used to determine the state of a process.
   */
  idempotency_key: string
  /**
   * Date which the idempotency key was locked.
   */
  created_at: string
  /**
   * Date which the idempotency key was locked.
   */
  locked_at: string | null
  /**
   * The method of the request
   */
  request_method: string | null
  /**
   * The parameters passed to the request
   */
  request_params: Record<string, any> | null
  /**
   * The request's path
   */
  request_path: string | null
  /**
   * The response's code.
   */
  response_code: string | null
  /**
   * The response's body
   */
  response_body: Record<string, any> | null
  /**
   * Where to continue from.
   */
  recovery_point: string
}
