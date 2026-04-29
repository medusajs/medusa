import { Constructor, FileTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { FileProviderRegistrationPrefix } from "@types"
import type { Readable, Writable } from "stream"

type InjectedDependencies = {
  [
    key: `${typeof FileProviderRegistrationPrefix}${string}`
  ]: FileTypes.IFileProvider
}

export default class FileProviderService {
  protected readonly fileProvider_: FileTypes.IFileProvider

  constructor(container: InjectedDependencies) {
    const fileProviderKeys = Object.keys(container).filter((k) =>
      k.startsWith(FileProviderRegistrationPrefix)
    )

    if (fileProviderKeys.length !== 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `File module should be initialized with exactly one provider`
      )
    }

    this.fileProvider_ = container[fileProviderKeys[0]]
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<FileTypes.IFileProvider>,
    optionName?: string
  ) {
    return `${(providerClass as any).identifier}_${optionName}`
  }

  upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    return this.fileProvider_.upload(file)
  }

  delete(
    fileData:
      | FileTypes.ProviderDeleteFileDTO
      | FileTypes.ProviderDeleteFileDTO[]
  ): Promise<void> {
    return this.fileProvider_.delete(fileData)
  }

  getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    return this.fileProvider_.getPresignedDownloadUrl(fileData)
  }

  getPresignedUploadUrl(
    fileData: FileTypes.ProviderGetPresignedUploadUrlDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!this.fileProvider_.getPresignedUploadUrl) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Provider does not support presigned upload URLs"
      )
    }

    if (!fileData.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "File name is required to get a presigned upload URL"
      )
    }

    return this.fileProvider_.getPresignedUploadUrl(fileData)
  }

  getDownloadStream(fileData: FileTypes.ProviderGetFileDTO): Promise<Readable> {
    return this.fileProvider_.getDownloadStream(fileData)
  }

  getAsBuffer(fileData: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    return this.fileProvider_.getAsBuffer(fileData)
  }

  getUploadStream(fileData: FileTypes.ProviderUploadStreamDTO): Promise<{
    writeStream: Writable
    promise: Promise<FileTypes.ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    return this.fileProvider_.getUploadStream(fileData)
  }
}
