/**
 * The File to be created.
 */
export interface CreateFileDTO {
  /**
   * The filename of the uploaded file
   */
  filename: string

  /**
   * The mimetype of the uploaded file
   */
  mimeType: string

  /**
   * The file content as a binary-encoded string
   */
  content: string
}
