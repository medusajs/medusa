import { Readable, Writable } from "stream"
import { FileAccessPermission } from "./common"

/**
 * @interface
 *
 * Details of a file upload's result.
 */
export type ProviderFileResultDTO = {
  /**
   * The file's URL that users or systems
   * can use to access the file.
   */
  url: string
  /**
   * The file's key allowing you to later
   * identify the file in the third-party
   * system. For example, the S3 Module Provider
   * returns the file's key in S3, whereas the
   * Local File Module Provider returns the file's
   * path.
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
   * The file's key allowing you to later
   * identify the file in the third-party
   * system. For example, the S3 Module Provider
   * returns the file's key in S3, whereas the
   * Local File Module Provider returns the file's
   * path.
   */
  fileKey: string
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
   * The file content as a base64-encoded string
   */
  content: string

  /**
   * The access level of the file. Defaults to private if not passed
   */
  access?: FileAccessPermission
}

/**
 * @interface
 *
 * The details of the file to get a presigned upload URL for.
 */
export type ProviderGetPresignedUploadUrlDTO = {
  /**
   * The filename of the file to get a presigned upload URL for.
   */
  filename: string

  /**
   * The mimetype of the file to get a presigned upload URL for.
   */
  mimeType?: string

  /**
   * The access level of the file to get a presigned upload URL for.
   */
  access?: FileAccessPermission

  /**
   * The validity of the presigned upload URL in seconds.
   */
  expiresIn?: number
}

/**
 * @interface
 *
 * The details of the file to upload via a stream.
 */
export type ProviderUploadStreamDTO = {
  /**
   * The filename of the uploaded file
   */
  filename: string

  /**
   * The mimetype of the uploaded file
   */
  mimeType: string

  /**
   * The access level of the file. Defaults to private if not passed
   */
  access?: FileAccessPermission
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
   * This method is used to delete one or more files from the storage
   *
   * @param {ProviderDeleteFileDTO | ProviderDeleteFileDTO[]} fileData - The details of the files to remove.
   * @returns {Promise<void>} Resolves when the file is deleted successfully.
   *
   */
  delete(
    fileData: ProviderDeleteFileDTO | ProviderDeleteFileDTO[]
  ): Promise<void>

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

  /**
   * This method is used to get a presigned upload URL for a file. For some providers,
   * such as S3, a presigned URL indicates a temporary URL to get upload a file.
   *
   * If your provider doesn’t perform or offer a similar functionality, you don't have to
   * implement this method. Instead, an error is thrown when the method is called.
   *
   * @param {ProviderGetPresignedUploadUrlDTO} fileData - The details of the file to get a presigned upload URL for.
   * @returns {Promise<ProviderFileResultDTO>} The presigned URL and file key to upload the file to
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async getPresignedUploadUrl(
   *     fileData: ProviderGetPresignedUploadUrlDTO
   *   ): Promise<ProviderFileResultDTO> {
   *     // TODO logic to get the presigned upload URL
   *     // for example:
   *     return this.client.getPresignedUploadUrl(fileData.filename, fileData.mimeType)
   *   }
   * }
   *
   */
  getPresignedUploadUrl?(
    fileData: ProviderGetPresignedUploadUrlDTO
  ): Promise<ProviderFileResultDTO>

  /**
   * Get the file contents as a readable stream.
   */
  getDownloadStream(fileData: ProviderGetFileDTO): Promise<Readable>

  /**
   * Get the file contents as a Node.js Buffer
   */
  getAsBuffer(fileData: ProviderGetFileDTO): Promise<Buffer>

  /**
   * Get a writeable stream to upload a file.
   */
  getUploadStream(fileData: ProviderUploadStreamDTO): Promise<{
    writeStream: Writable
    promise: Promise<ProviderFileResultDTO>
    url: string
    fileKey: string
  }>
}
