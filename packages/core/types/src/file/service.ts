import { IModuleService } from "../modules-sdk"
import { FileDTO, FilterableFileProps } from "./common"
import { FindConfig } from "../common"
import { Context } from "../shared-context"
import { CreateFileDTO } from "./mutations"

/**
 * The main service interface for the File Module.
 */
export interface IFileModuleService extends IModuleService {
  /**
   * This method uploads files to the designated file storage system.
   *
   * @param {CreateFileDTO[]} data - The files to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO[]>} The created files.
   *
   * @example
   * const [file] = await fileModuleService.create([{
   *   filename: "product.png",
   *   mimeType: "image/png",
   *   content: "somecontent"
   * }])
   */
  create(data: CreateFileDTO[], sharedContext?: Context): Promise<FileDTO[]>

  /**
   * This method uploads a file to the designated file storage system.
   *
   * @param {CreateFileDTO} data - The file to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO>} The created file.
   *
   * @example
   * const file = await fileModuleService.create({
   *   filename: "product.png",
   *   mimeType: "image/png",
   *   content: "somecontent"
   * })
   */

  create(data: CreateFileDTO, sharedContext?: Context): Promise<FileDTO>

  /**
   * This method deletes files by their IDs.
   *
   * @param {string[]} ids - The IDs of the files.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the files are deleted successfully.
   *
   * @example
   * await fileModuleService.delete(["file_123"])
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a file by its ID.
   *
   * @param {string} id - The ID of the file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the file is deleted successfully.
   *
   * @example
   * await fileModuleService.delete("file_123")
   */
  delete(id: string, sharedContext?: Context): Promise<void>

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
   * const file = await fileModuleService.retrieve("file_123")
   */
  retrieve(
    id: string,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<FileDTO>

  /**
   * This method is used to retrieve a file by ID, similarly to `retrieve`. Enumeration of files is not supported, but the list method is in order to support remote queries
   *
   * @param {FilterableFileProps} filters - The filters to apply on the retrieved files.
   * @param {FindConfig<FileDTO>} config -
   * The configurations determining how the files are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<FileDTO[]>} The list of files. In this particular case, it will either be at most one file.
   *
   */
  list(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<FileDTO[]>

  /**
   * This method is used to retrieve a file by ID, similarly to `retrieve`. Enumeration of files is not supported, but the listAndCount method is in order to support remote queries
   *
   * @param {FilterableFileProps} filters - The filters to apply on the retrieved files.
   * @param {FindConfig<FileDTO>} config -
   * The configurations determining how the files are retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a file.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[FileDTO[], number]>} The list of files and their count. In this particular case, it will either be at most one file.
   *
   */
  listAndCount(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<[FileDTO[], number]>
}
