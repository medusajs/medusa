import { Constructor, DAL, FileTypes } from "@medusajs/types"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  [key: `file_${string}`]: FileTypes.IFileProvider
}

export default class FileProviderService {
  protected readonly fileProvider_: FileTypes.IFileProvider

  constructor(container: InjectedDependencies) {
    if (Object.keys(container).length !== 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `File module should only be initialized with one provider`
      )
    }

    this.fileProvider_ = Object.values(container)[0]
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

  delete(fileData: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    return this.fileProvider_.delete(fileData)
  }

  getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    return this.fileProvider_.getPresignedDownloadUrl(fileData)
  }
}
