import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "../interfaces"

class DefaultFileService extends AbstractFileService<any> {
  upload(fileData: Express.Multer.File): Promise<FileServiceUploadResult> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  delete(fileData: Record<string, any>): void {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  getPresignedDownloadUrl(fileData: GetUploadedFileType): Promise<string> {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Please add a file service plugin in order to manipulate files in Medusa"
    )
  }
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
}

export default DefaultFileService
