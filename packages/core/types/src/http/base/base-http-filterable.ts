import { BaseFilterable, OperatorMap } from "../../dal"

export interface BaseHttpFilterable<T> extends BaseFilterable<T> {
  /**
   * An ID or array of IDs to filter the results by.
   */
  id?: string | string[]
  /**
   * A query string to filter the results by.
   */
  q?: string
  /**
   * A object to filter results by their `created_at` field.
   *
   * @example
   * ```ts
   * const created_at: OperatorMap<string> = {
   *    $gt: "2021-01-01T00:00:00Z",
   *    $lt: "2021-12-31T23:59:59Z"
   * }
   * ```
   */
  created_at?: OperatorMap<string>
  /**
   * A object to filter results by their `updated_at` field
   *
   * @example
   * ```ts
   * const updated_at: OperatorMap<string> = {
   *   $gt: "2021-01-01T00:00:00Z",
   *   $lt: "2021-12-31T23:59:59Z"
   * }
   * ```
   */
  updated_at?: OperatorMap<string>
}

export interface BaseHttpFilterableWithDeletedAt<T>
  extends BaseHttpFilterable<T> {
  /**
   * A object to filter results by their `deleted_at` field
   *
   * @example
   * ```ts
   * const deleted_at: OperatorMap<string> = {
   *    $gt: "2021-01-01T00:00:00Z",
   *    $lt: "2021-12-31T23:59:59Z"
   * }
   * ```
   */
  deleted_at?: OperatorMap<string>
}
