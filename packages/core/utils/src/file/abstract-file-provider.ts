import { FileTypes, IFileProvider } from "@medusajs/types"

export class AbstractFileProviderService implements IFileProvider {
  static identifier: string

  getIdentifier() {
    return (this.constructor as any).identifier
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    throw Error("upload must be overridden by the child class")
  }
  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    throw Error("delete must be overridden by the child class")
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    throw Error("getPresignedDownloadUrl must be overridden by the child class")
  }
}
