import { FileTypes, IFileProvider } from "@medusajs/types"
import type { Readable, Writable } from "stream"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts
 * import { Logger } from "@medusajs/framework/types"
 * import { AbstractFileProviderService } from "@medusajs/framework/utils"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   apiKey: string
 * }
 *
 * class MyFileProviderService extends AbstractFileProviderService {
 *   protected logger_: Logger
 *   protected options_: Options
 *   static identifier = "my-file"
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super()
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 * }
 *
 * export default MyFileProviderService
 * ```
 */
export class AbstractFileProviderService implements IFileProvider {
  /**
   * Each file provider has a unique ID used to identify it. The provider's ID
   * will be stored as `fs_{identifier}_{id}`, where `{id}` is the provider's `id`
   * property in the `medusa-config.ts`.
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   static identifier = "my-file"
   *   // ...
   * }
   */
  static identifier: string

  /**
   * This method validates the options of the provider set in `medusa-config.ts`.
   * Implementing this method is optional. It's useful if your provider requires custom validation.
   *
   * If the options aren't valid, throw an error.
   *
   * @param options - The provider's options.
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   static validateOptions(options: Record<any, any>) {
   *     if (!options.apiKey) {
   *       throw new MedusaError(
   *         MedusaError.Types.INVALID_DATA,
   *         "API key is required in the provider's options."
   *       )
   *     }
   *   }
   * }
   */
  static validateOptions(options: Record<any, any>): void | never {}

  /**
   * @ignore
   */
  getIdentifier() {
    return (this.constructor as any).identifier
  }

  /**
   * This method uploads a file using your provider's custom logic. In this method, you can upload the file
   * into your provider's storage, and return the uploaded file's details.
   *
   * This method will be used when uploading product images, CSV files for imports, or other
   * custom file uploads.
   *
   * @param {FileTypes.ProviderUploadFileDTO} file - The file to upload.
   * @returns {Promise<FileTypes.ProviderFileResultDTO>} The uploaded file's details.
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async upload(
   *     file: ProviderUploadFileDTO
   *   ): Promise<ProviderFileResultDTO> {
   *     // TODO upload file to third-party provider
   *     // or using custom logic
   *     // for example:
   *     this.client.upload(file)
   *
   *     return {
   *       url: "some-url.com",
   *       key: "file-name-or-id"
   *     }
   *   }
   * }
   */
  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    throw Error("upload must be overridden by the child class")
  }

  /**
   * This method deletes one or more files from the storage. It's used when an admin user
   * deletes a product image, or other custom file deletions.
   *
   * @param {FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]} files - The details of the files to delete.
   * @returns {Promise<void>} Resolves when the files are deleted.
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async delete(
   *     files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]
   *   ): Promise<void> {
   *     // TODO logic to remove the file from storage
   *     // Use the `file.fileKey` to delete the file, which is the identifier of the file
   *    // in the provider's storage.
   *     // for example:
   *     const fileArray = Array.isArray(files) ? files : [files]
   *     for (const file of fileArray) {
   *       this.client.delete(file.fileKey)
   *     }
   *   }
   * }
   */
  async delete(
    files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]
  ): Promise<void> {
    throw Error("delete must be overridden by the child class")
  }

  /**
   * This method is used to retrieve a download URL of the file. For some providers,
   * such as S3, a presigned URL indicates a temporary URL to get access to a file.
   *
   * If your provider doesn’t perform or offer a similar functionality, you can
   * return the URL to download the file.
   *
   * @param {FileTypes.ProviderGetFileDTO} fileData - The details of the file to get its
   * presigned URL.
   * @returns {Promise<string>} The file's presigned URL.
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async getPresignedDownloadUrl(
   *     fileData: ProviderGetFileDTO
   *   ): Promise<string> {
   *     // TODO logic to get the presigned URL
   *     // Use the `file.fileKey` to delete the file, which is the identifier of the file
   *    // in the provider's storage.
   *     // for example:
   *     return this.client.getPresignedUrl(fileData.fileKey)
   *   }
   * }
   */
  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    throw Error("getPresignedDownloadUrl must be overridden by the child class")
  }

  /**
   * This method retrieves an uploaded file as a stream. This is useful when streaming
   * a file to clients or you want to process the file in chunks.
   *
   * @param {FileTypes.ProviderGetFileDTO} fileData - The details of the file to get its stream.
   * @returns {Promise<Readable>} The file's stream.
   *
   * @since 2.8.0
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async getAsStream(file: ProviderDeleteFileDTO): Promise<Readable> {
   *    // TODO logic to get the file as a stream
   *    // Use the `file.fileKey` to get the file, which is the identifier of the file
   *    // in the provider's storage.
   *    // for example:
   *     this.client.getAsStream(file.fileKey)
   *   }
   * }
   */
  getDownloadStream(fileData: FileTypes.ProviderGetFileDTO): Promise<Readable> {
    throw Error("getDownloadStream must be overridden by the child class")
  }

  /**
   * This method retrieves an uploaded file as a buffer. This is useful when you want to
   * process the entire file in memory or send it as a response.
   *
   * @param {FileTypes.ProviderGetFileDTO} fileData - The details of the file to get its buffer.
   * @returns {Promise<Buffer>} The file's buffer.
   *
   * @since 2.8.0
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async getAsBuffer(file: ProviderDeleteFileDTO): Promise<Buffer> {
   *     // TODO logic to get the file as a buffer
   *     // Use the `file.fileKey` to get the file, which is the identifier of the file
   *     // in the provider's storage.
   *     // for example:
   *     this.client.getAsBuffer(file.fileKey)
   *   }
   * }
   */
  getAsBuffer(fileData: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    throw Error("getAsBuffer must be overridden by the child class")
  }

  /**
   * This method returns a writeable stream to upload a file.
   *
   * @param {FileTypes.ProviderUploadStreamDTO} fileData - The details of the file to upload.
   * @returns {Promise<{ writeStream: Writable, promise: Promise<FileTypes.ProviderFileResultDTO>, url: string, fileKey: string }>} The writeable stream and upload promise.
   *
   * @since 2.8.0
   *
   * @example
   * class MyFileProviderService extends AbstractFileProviderService {
   *   // ...
   *   async getUploadStream(fileData: FileTypes.ProviderUploadStreamDTO): Promise<{
   *     writeStream: Writable
   *     promise: Promise<FileTypes.ProviderFileResultDTO>
   *     url: string
   *     fileKey: string
   *   }> {
   *     // TODO logic to get the writeable stream
   *   }
   * }
   */
  getUploadStream(fileData: FileTypes.ProviderUploadStreamDTO): Promise<{
    writeStream: Writable
    promise: Promise<FileTypes.ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    throw Error("getUploadStream must be overridden by the child class")
  }
}
