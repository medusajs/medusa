export interface BaseHttpEntity {
  /**
   * Unique identifier for the entity.
   */
  id: string
  /**
   * ISO 8601 formatted date and time string (e.g., "2024-05-24T08:34:40.812Z") representing the time when the entity was created.
   */
  created_at: string
  /**
   * ISO 8601 formatted date and time string (e.g., "2024-05-24T08:34:40.812Z") representing the time when the entity was last updated.
   */
  updated_at: string
  /**
   * ISO 8601 formatted date and time string (e.g., "2024-05-24T08:34:40.812Z") representing the time when the entity was deleted.
   */
  deleted_at: string | null
  /**
   * Metadata associated with the entity.
   */
  metadata: Record<string, unknown> | null
}

export interface BaseSoftDeletableHttpEntity extends BaseHttpEntity {
  /**
   * ISO 8601 formatted date and time string (e.g., "2024-05-24T08:34:40.812Z") representing the time when the entity was deleted.
   */
  deleted_at: string | null
}
