import { Constructor, FileTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { FileProviderRegistrationPrefix } from "@types"

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

  delete(fileData: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    return this.fileProvider_.delete(fileData)
  }

  getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    return this.fileProvider_.getPresignedDownloadUrl(fileData)
  }
}
