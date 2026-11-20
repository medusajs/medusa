/**
 * The configurations to import products.
 */
export interface ImportProductsDTO {
  /**
   * The content of the CSV file.
   */
  fileContent: string
  /**
   * The name of the CSV file.
   */
  filename: string
  /**
   * The user id or email to send the notification to. If not provided, the
   * notification will be sent to all admin users.
   */
  to?: string
}

export interface ImportProductsSummary {
  toCreate: number
  toUpdate: number
}
