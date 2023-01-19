/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Idempotency Key is used to continue a process in case of any failure that might occur.
 */
export type IdempotencyKey = {
  /**
   * The idempotency key's ID
   */
  id?: string;
  /**
   * The unique randomly generated key used to determine the state of a process.
   */
  idempotency_key: string;
  /**
   * Date which the idempotency key was locked.
   */
  created_at?: string;
  /**
   * Date which the idempotency key was locked.
   */
  locked_at?: string;
  /**
   * The method of the request
   */
  request_method?: string;
  /**
   * The parameters passed to the request
   */
  request_params?: Record<string, any>;
  /**
   * The request's path
   */
  request_path?: string;
  /**
   * The response's code.
   */
  response_code?: string;
  /**
   * The response's body
   */
  response_body?: Record<string, any>;
  /**
   * Where to continue from.
   */
  recovery_point?: string;
};

