/**
 * @interface
 *
 * Details of a file upload's result.
 */
export type ProviderFileResultDTO = {
  /**
   * The file's URL.
   */
  url: string
  /**
   * The file's key.
   */
  key: string
}

/**
 * @interface
 *
 * The details of a file to retrieve.
 */
export type ProviderGetFileDTO = {
  /**
   * The file's key.
   */
  fileKey: string
  /**
   * Whether the file is private.
   */
  isPrivate?: boolean
  [x: string]: unknown
}

/**
 * @interface
 *
 * The details of the file to remove.
 */
export type ProviderDeleteFileDTO = {
  /**
   * The file's key. When uploading a file, the
   * returned key is used here.
   */
  fileKey: string
  [x: string]: unknown
}

/**
 * @interface
 *
 * The details of the file to create.
 */
export type ProviderUploadFileDTO = {
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

export interface IFileProvider {
  /**
   * This method is used to upload a file
   *
   * @param {ProviderUploadFileDTO} file - The contents and metadata of the file.
   * Among the file’s details, you can access the file’s path in the `path` property of the file object.
   * @returns {Promise<ProviderFileResultDTO>} The details of the upload's result.
   *
   */
  upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO>
  /**
   * This method is used to delete a file from storage.
   *
   * @param {ProviderDeleteFileDTO} fileData - The details of the file to remove.
   * @returns {Promise<void>} Resolves when the file is deleted successfully.
   *
   */
  delete(fileData: ProviderDeleteFileDTO): Promise<void>
  /**
   * This method is used to retrieve a download URL of the file. For some file services, such as S3, a presigned URL indicates a temporary URL to get access to a file.
   *
   * If your file service doesn’t perform or offer a similar functionality, you can just return the URL to download the file.
   *
   * @param {ProviderGetFileDTO} fileData - The details of the file.
   * @returns {Promise<string>} The presigned URL to download the file
   *
   */
  getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string>
}
