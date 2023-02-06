import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "../interfaces"

class DefaultFileService extends AbstractFileService {
  async upload(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  async uploadProtected(
    fileData: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  async delete(fileData: Record<string, any>): Promise<void> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
}

export default DefaultFileService
