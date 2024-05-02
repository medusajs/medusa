import { FileTypes } from "@medusajs/types"
import { AbstractFileProviderService } from "@medusajs/utils"

export class FileProviderServiceFixtures extends AbstractFileProviderService {
  static identifier = "fixtures-file-provider"
  protected storage = {}
  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    this.storage[file.filename] = file.content
    return {
      url: file.filename,
      key: file.filename,
    }
  }
  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    delete this.storage[file.fileKey]
    return
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    if (this.storage[fileData.fileKey]) {
      return this.storage[fileData.fileKey]
    }

    return ""
  }
}

export const services = [FileProviderServiceFixtures]
