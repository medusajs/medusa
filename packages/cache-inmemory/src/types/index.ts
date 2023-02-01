/**
 * Shape of a record saved in ``in-memory  cache
 */
export type CacheRecord<T> = {
  data: T
  /**
   * Timestamp in milliseconds
   */
  expire: number
}
