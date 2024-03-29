import { TransactionBaseService } from "./transaction-base-service"
import {
  DeleteFileType,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  MedusaContainer,
  UploadStreamDescriptorType,
} from "@medusajs/types"

/**
 * ## Overview
 *
 * A file service class is defined in a TypeScript or JavaScript file that’s created in the `src/services` directory.
 * The class must extend the `AbstractFileService` class imported from the `@medusajs/medusa` package.
 *
 * Based on services’ naming conventions, the file’s name should be the slug version of the file service’s name
 * without `service`, and the class’s name should be the pascal case of the file service’s name following by `Service`.
 *
 * For example, create the file `src/services/local-file.ts` with the following content:
 *
 * ```ts title="src/services/local-file.ts"
 * import { AbstractFileService } from "@medusajs/medusa"
 * import {
 *   DeleteFileType,
 *   FileServiceGetUploadStreamResult,
 *   FileServiceUploadResult,
 *   GetUploadedFileType,
 *   UploadStreamDescriptorType,
 * } from "@medusajs/types"
 *
 * class LocalFileService extends AbstractFileService {
 *   async upload(
 *     fileData: Express.Multer.File
 *   ): Promise<FileServiceUploadResult> {
 *     throw new Error("Method not implemented.")
 *   }
 *   async uploadProtected(
 *     fileData: Express.Multer.File
 *   ): Promise<FileServiceUploadResult> {
 *     throw new Error("Method not implemented.")
 *   }
 *   async delete(fileData: DeleteFileType): Promise<void> {
 *     throw new Error("Method not implemented.")
 *   }
 *   async getUploadStreamDescriptor(
 *     fileData: UploadStreamDescriptorType
 *   ): Promise<FileServiceGetUploadStreamResult> {
 *     throw new Error("Method not implemented.")
 *   }
 *   async getDownloadStream(
 *     fileData: GetUploadedFileType
 *   ): Promise<NodeJS.ReadableStream> {
 *     throw new Error("Method not implemented.")
 *   }
 *   async getPresignedDownloadUrl(
 *     fileData: GetUploadedFileType
 *   ): Promise<string> {
 *     throw new Error("Method not implemented.")
 *   }
 * }
 *
 * export default LocalFileService
 * ```
 *
 * :::note[Multer Typing]
 *
 * The examples implement a file service supporting local uploads.
 *
 * If you’re using TypeScript and you're following along with the implementation,
 * you should install the Multer types package in the root of your Medusa backend to resolve errors within your file service types:
 *
 * ```bash npm2yarn
 * npm install @types/multer
 * ```
 *
 * :::
 *
 * ---
 */
export interface IFileService extends TransactionBaseService {
  /**
   * This method is used to upload a file to the Medusa backend.
   *
   * @param {Express.Multer.File} file - A [multer file object](http://expressjs.com/en/resources/middleware/multer.html#file-information).
   * The file is uploaded to a temporary directory by default. Among the file’s details, you can access the file’s path in the `path` property of the file object.
   * @returns {Promise<FileServiceUploadResult>} The details of the upload's result.
   *
   * @example
   * ```ts
   * class LocalFileService extends AbstractFileService {
   *   // ...
   *   async upload(
   *     fileData: Express.Multer.File
   *   ): Promise<FileServiceUploadResult> {
   *     const filePath =
   *       `${this.publicPath}/${fileData.originalname}`
   *     fs.copyFileSync(fileData.path, filePath)
   *     return {
   *       url: `${this.serverUrl}/${filePath}`,
   *       key: filePath,
   *     }
   *   }
   *   // ...
   * }
   * ```
   *
   * :::tip
   *
   * This example does not account for duplicate names to maintain simplicity in this guide. So, an uploaded file can replace another existing file that has the same name.
   *
   * :::
   */
  upload(file: Express.Multer.File): Promise<FileServiceUploadResult>

  /**
   * This method is used to upload a file to the Medusa backend, but to a protected storage. Typically, this would be used to store files that
   * shouldn’t be accessible by using the file’s URL or should only be accessible by authenticated users. For example, exported or imported
   * CSV files.
   *
   * @param {Express.Multer.File} file - A [multer file object](http://expressjs.com/en/resources/middleware/multer.html#file-information).
   * The file is uploaded to a temporary directory by default. Among the file’s details, you can access the file’s path in the `path` property of the file object.
   * @returns {Promise<FileServiceUploadResult>} The details of the upload's result.
   *
   * @example
   * ```ts
   * class LocalFileService extends AbstractFileService {
   *   // ...
   *   async uploadProtected(
   *     fileData: Express.Multer.File
   *   ): Promise<FileServiceUploadResult> {
   *     const filePath =
   *       `${this.protectedPath}/${fileData.originalname}`
   *     fs.copyFileSync(fileData.path, filePath)
   *     return {
   *       url: `${this.serverUrl}/${filePath}`,
   *       key: filePath
   *     }
   *   }
   *   // ...
   * }
   * ```
   *
   * :::tip
   *
   * This example does not account for duplicate names to maintain simplicity in this guide. So, an uploaded file can replace another existing file that has the same name.
   *
   * :::
   */
  uploadProtected(file: Express.Multer.File): Promise<FileServiceUploadResult>

  /**
   * This method is used to delete a file from storage.
   *
   * @param {DeleteFileType} fileData - The details of the file to remove.
   * @returns {Promise<void>} Resolves when the file is deleted successfully.
   *
   * @example
   * class LocalFileService extends AbstractFileService {
   *
   *   async delete(
   *     fileData: DeleteFileType
   *   ): Promise<void> {
   *     fs.rmSync(fileData.fileKey)
   *   }
   *
   *   // ...
   * }
   */
  delete(fileData: DeleteFileType): Promise<void>

  /**
   * This method is used to retrieve a write stream to be used to upload a file.
   *
   * @param {UploadStreamDescriptorType} fileData - The details of the file being uploaded.
   * @returns {Promise<FileServiceGetUploadStreamResult>} The result of the file-stream upload.
   *
   * @example
   * // ...
   * import { Stream } from "stream"
   *
   * class LocalFileService extends AbstractFileService {
   *   // ...
   *   async getUploadStreamDescriptor({
   *       name,
   *       ext,
   *       isPrivate = true,
   *     }: UploadStreamDescriptorType
   *   ): Promise<FileServiceGetUploadStreamResult> {
   *     const filePath = `${isPrivate ?
   *       this.publicPath : this.protectedPath
   *     }/${name}.${ext}`
   *
   *     const pass = new Stream.PassThrough()
   *     const writeStream = fs.createWriteStream(filePath)
   *
   *     pass.pipe(writeStream)
   *
   *     return {
   *       writeStream: pass,
   *       promise: Promise.resolve(),
   *       url: `${this.serverUrl}/${filePath}`,
   *       fileKey: filePath,
   *     }
   *   }
   *   // ...
   * }
   */
  getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult>

  /**
   * This method is used to retrieve a read stream for a file, which can then be used to download the file.
   *
   * @param {GetUploadedFileType} fileData - The details of the file.
   * @returns {Promise<NodeJS.ReadableStream>} The [read stream](https://nodejs.org/api/webstreams.html#class-readablestream) to read and download the file.
   *
   * @example
   * class LocalFileService extends AbstractFileService {
   *
   *   async getDownloadStream({
   *       fileKey,
   *       isPrivate = true,
   *     }: GetUploadedFileType
   *   ): Promise<NodeJS.ReadableStream> {
   *     const filePath = `${isPrivate ?
   *       this.publicPath : this.protectedPath
   *     }/${fileKey}`
   *     const readStream = fs.createReadStream(filePath)
   *
   *     return readStream
   *   }
   *
   *   // ...
   * }
   */
  getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream>

  /**
   * This method is used to retrieve a download URL of the file. For some file services, such as S3, a presigned URL indicates a temporary URL to get access to a file.
   *
   * If your file service doesn’t perform or offer a similar functionality, you can just return the URL to download the file.
   *
   * @param {GetUploadedFileType} fileData - The details of the file.
   * @returns {Promise<string>} The presigned URL to download the file
   *
   * @example
   * class LocalFileService extends AbstractFileService {
   *
   *   async getPresignedDownloadUrl({
   *       fileKey,
   *       isPrivate = true,
   *     }: GetUploadedFileType
   *   ): Promise<string> {
   *     // Local upload doesn't provide
   *     // support for presigned URLs,
   *     // so just return the file's URL.
   *
   *     const filePath = `${isPrivate ?
   *       this.publicPath : this.protectedPath
   *     }/${fileKey}`
   *     return `${this.serverUrl}/${filePath}`
   *   }
   *
   *   // ...
   * }
   */
  getPresignedDownloadUrl(fileData: GetUploadedFileType): Promise<string>
}

/**
 * @parentIgnore activeManager_,atomicPhase_,shouldRetryTransaction_,withTransaction
 */
export abstract class AbstractFileService
  extends TransactionBaseService
  implements IFileService
{
  /**
   * @ignore
   */
  static _isFileService = true

  /**
   * @ignore
   */
  static isFileService(object): object is AbstractFileService {
    return object?.constructor?._isFileService
  }

  /**
   * You can use the `constructor` of your file service to access the different services in Medusa through dependency injection.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs,
   * you can initialize it in the constructor and use it in other methods in the service.
   *
   * Additionally, if you’re creating your file service as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin,
   * you can access them in the constructor.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} config - If this file service is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * // ...
   * import { Logger } from "@medusajs/medusa"
   * import * as fs from "fs"
   *
   * class LocalFileService extends AbstractFileService {
   *   // can also be replaced by an environment variable
   *   // or a plugin option
   *   protected serverUrl = "http://localhost:9000"
   *   protected publicPath = "uploads"
   *   protected protectedPath = "protected-uploads"
   *   protected logger_: Logger
   *
   *   constructor({ logger }: InjectedDependencies) {
   *     // @ts-ignore
   *     super(...arguments)
   *     this.logger_ = logger
   *
   *     // for public uploads
   *     if (!fs.existsSync(this.publicPath)) {
   *       fs.mkdirSync(this.publicPath)
   *     }
   *
   *     // for protected uploads
   *     if (!fs.existsSync(this.protectedPath)) {
   *       fs.mkdirSync(this.protectedPath)
   *     }
   *   }
   *   // ...
   * }
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    super(container, config)
  }

  abstract upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult>

  abstract uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult>

  abstract delete(fileData: DeleteFileType): Promise<void>

  abstract getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult>

  abstract getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream>

  abstract getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string>
}
