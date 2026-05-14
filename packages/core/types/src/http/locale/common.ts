export interface BaseLocale {
  /**
   * The locale's code.
   *
   * @example
   * en-US
   */
  code: string
  /**
   * The locale's display name.
   *
   * @example
   * English (United States)
   */
  name: string
  /**
   * The date the locale was created.
   */
  created_at: string
  /**
   * The date the locale was updated.
   */
  updated_at: string
  /**
   * The date the locale was deleted.
   */
  deleted_at: string | null
}
