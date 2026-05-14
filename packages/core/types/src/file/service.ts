import type { Writable } from "stream"
import { Readable } from "stream"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import { FileDTO, FilterableFileProps, UploadFileUrlDTO } from "./common"
import { CreateFileDTO, GetUploadFileUrlDTO } from "./mutations"
import {
  IFileProvider,
  ProviderFileResultDTO,
  ProviderUploadStreamDTO,
} from "./provider"

export interface IFileModuleService extends IModuleService {
  /**
   * This method returns the service of the configured File Module Provider in `medusa-config.ts`. This is useful
   * if you want to execute custom methods defined in the provider's service or you need direct access to it.
   *
   * @returns {IFileProvider} An instance of the File Module Provider's service.
   *
   * @example
   * const s3ProviderService = fileModuleService.getProvider()
   * // TODO: perform custom actions with the provider
   */
  getProvider(): IFileProvider

  /**
   * This method uploads files to the designated file storage system.
   *
   * @param {CreateFileDTO[]} data - The files to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO[]>} The created files.
   *
   * @example
   * const [file] = await fileModuleService.createFiles([{
   *   filename: "product.png",
   *   mimeType: "image/png",
   *   content: "somecontent" // base64 string
   * }])
   */
  createFiles(
    data: CreateFileDTO[],
    sharedContext?: Context
  ): Promise<FileDTO[]>

  /**
   * This method uploads a file to the designated file storage system.
   *
   * @param {CreateFileDTO} data - The file to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO>} The created file.
   *
   * @example
   * const file = await fileModuleService.createFiles({
   *   filename: "product.png",
   *   mimeType: "image/png",
   *   content: "somecontent" // base64 string
   * })
   */

  createFiles(data: CreateFileDTO, sharedContext?: Context): Promise<FileDTO>

  /**
   * This method gets the upload URL for a file.
   *
   * @param {GetUploadFileUrlDTO} data - The file information to get the upload URL for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UploadFileUrlDTO>} The upload URL for the file.
   *
   * @example
   * const uploadInfo = await fileModuleService.getUploadFileUrls({
   *   filename: "product.png",
   *   mimeType: "image/png",
   * })
   */

  getUploadFileUrls(
    data: GetUploadFileUrlDTO,
    sharedContext?: Context
  ): Promise<UploadFileUrlDTO>

  /**
   * This method uploads files to the designated file storage system.
   *
   * @param {GetUploadFileUrlDTO[]} data - The file information to get the upload URL for.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UploadFileUrlDTO[]>} The upload URLs for the files.
   *
   * @example
   * const [uploadInfo] = await fileModuleService.getUploadFileUrls([{
   *   filename: "product.png",
   *   mimeType: "image/png",
   * }])
   */
  getUploadFileUrls(
    data: GetUploadFileUrlDTO[],
    sharedContext?: Context
  ): Promise<UploadFileUrlDTO[]>

  /**
   * This method deletes files by their IDs.
   *
   * @param {string[]} ids - The IDs of the files.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the files are deleted successfully.
   *
   * @example
   * await fileModuleService.deleteFiles(["file_123"])
   */
  deleteFiles(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a file by its ID.
   *
   * @param {string} id - The ID of the file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the file is deleted successfully.
   *
   * @example
   * await fileModuleService.deleteFiles("file_123")
   */
  deleteFiles(id: string, sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a file with a downloadable URL by its ID.
   *
   * @param {string} id - The ID of the file.
   * @param {FindConfig<FileDTO>} config - The configurations determining how the file is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO>} The retrieved file.
   *
   * @example
   * const file = await fileModuleService.retrieveFile("file_123")
   */
  retrieveFile(
    id: string,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<FileDTO>

  /**
   * This method is used to list files. It only supports filtering by ID.
   *
   * @param {FilterableFileProps} filters - The filters to apply on the retrieved files.
   * @param {FindConfig<FileDTO>} config -
   * The configurations determining how the files are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO[]>} The list of files.
   *
   * @example
   * const files = await fileModuleService.listFiles({ id: ["file_123", "file_456"] })
   */
  listFiles(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<FileDTO[]>

  /**
   * This method is used to list files and their count. It only supports filtering by ID.
   *
   * @param {FilterableFileProps} filters - The filters to apply on the retrieved files.
   * @param {FindConfig<FileDTO>} config -
   * The configurations determining how the files are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[FileDTO[], number]>} The list of files and their count.
   *
   * @example
   * const [files] = await fileModuleService.listAndCountFiles({ id: "file_123" })
   */
  listAndCountFiles(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<[FileDTO[], number]>

  /**
   * This method retrieves a file by its ID and returns a stream to download the file. Under the hood, it will use the
   * file provider that was used to upload the file to retrievethe stream.
   *
   * @since 2.8.0
   *
   * @param {string} id - The ID of the file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Readable>} A readable stream of the file contents.
   *
   * @example
   * const stream = await fileModuleService.getDownloadStream("file_123")
   * writeable.pipe(stream)
   */
  getDownloadStream(id: string, sharedContext?: Context): Promise<Readable>

  /**
   * This method retrieves a file by its ID and returns the file contents as a buffer. Under the hood, it will use the
   * file provider that was used to upload the file to retrieve the buffer.
   *
   * @since 2.8.0
   *
   * @param {string} id - The ID of the file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<Buffer>} A buffer of the file contents.
   *
   * @example
   * const contents = await fileModuleService.getAsBuffer("file_123")
   * contents.toString('utf-8')
   */
  getAsBuffer(id: string, sharedContext?: Context): Promise<Buffer>

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
