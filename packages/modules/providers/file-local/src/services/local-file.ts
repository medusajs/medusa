import { FileTypes, LocalFileServiceOptions } from "@medusajs/types"
import { AbstractFileProviderService, MedusaError } from "@medusajs/utils"
import fs from "fs/promises"
import path from "path"

export class LocalFileService extends AbstractFileProviderService {
  static identifier = "localfs"
  protected uploadDir_: string
  protected backendUrl_: string

  constructor(_, options: LocalFileServiceOptions) {
    super()
    this.uploadDir_ = options?.upload_dir || path.join(process.cwd(), "static")
    this.backendUrl_ = options?.backend_url || "http://localhost:9000/static"
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No file provided`)
    }

    if (!file.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No filename provided`
      )
    }

    const parsedFilename = path.parse(file.filename)
    await this.ensureDirExists(parsedFilename.dir)

    const fileKey = path.join(
      parsedFilename.dir,
      `${Date.now()}-${parsedFilename.base}`
    )

    const filePath = this.getUploadFilePath(fileKey)
    const fileUrl = this.getUploadFileUrl(fileKey)

    const content = Buffer.from(file.content as string, "binary")
    await fs.writeFile(filePath, content)

    return {
      key: fileKey,
      url: fileUrl,
    }
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    const filePath = this.getUploadFilePath(file.fileKey)
    try {
      await fs.access(filePath, fs.constants.F_OK)
      await fs.unlink(filePath)
    } catch (e) {
      // The file does not exist, so it's a noop.
    }

    return
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    try {
      await fs.access(
        this.getUploadFilePath(fileData.fileKey),
        fs.constants.F_OK
      )
    } catch {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `File with key ${fileData.fileKey} not found`
      )
    }

    return this.getUploadFileUrl(fileData.fileKey)
  }

  private getUploadFilePath = (fileKey: string) => {
    return path.join(this.uploadDir_, fileKey)
  }

  private getUploadFileUrl = (fileKey: string) => {
    const baseUrl = new URL(this.backendUrl_)
    baseUrl.pathname = path.join(baseUrl.pathname, fileKey)
    return baseUrl.href
  }

  private async ensureDirExists(dirPath: string) {
    const relativePath = path.join(this.uploadDir_, dirPath)
    try {
      await fs.access(relativePath, fs.constants.F_OK)
    } catch (e) {
      await fs.mkdir(relativePath, { recursive: true })
    }
  }
}
