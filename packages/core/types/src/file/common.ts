/**
 * The File details.
 */
export interface FileDTO {
  /**
   * The ID of the File.
   */
  id: string
  /**
   * The URL of the File.
   */
  url: string
}

/**
 * @interface
 *
 * Filters to apply on a currency.
 */
export interface FilterableFileProps {
  /**
   * The file ID to filter by.
   */
  id?: string
}
