import { FileAccessPermission } from "./common"

/**
 * The File to be created.
 */
export interface CreateFileDTO {
  /**
   * The name of the uploaded file
   */
  filename: string

  /**
   * The mimetype of the uploaded file
   *
   * @example
   * image/png
   */
  mimeType: string

  /**
   * The file content as a base64-encoded string.
   */
  content: string

  /**
   * The access level of the file. Defaults to private if not passed
   */
  access?: FileAccessPermission
}

export interface GetUploadFileUrlDTO {
  /**
   * The name of the file to be uploaded
   */
  filename: string

  /**
   * The mimetype of the file to be uploaded
   */
  mimeType?: string

  /**
   * The access level of the file to be uploaded. Defaults to private if not passed
   */
  access?: FileAccessPermission

  /**
   * The exact size of the file to be uploaded, in bytes. Providers that support it
   * sign it into the URL, so an upload of any other size is rejected.
   */
  size?: number
}
