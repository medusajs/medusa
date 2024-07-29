import { FileTypes, LocalFileServiceOptions } from "@medusajs/types"
import { AbstractFileProviderService, MedusaError } from "@medusajs/utils"
import fs from "fs/promises"
import path from "path"

export class LocalFileService extends AbstractFileProviderService {
  static identifier = "localfs"
  protected uploadDir_: string
  protected privateUploadDir_: string
  protected backendUrl_: string

  constructor(_, options: LocalFileServiceOptions) {
    super()
    this.uploadDir_ = options?.upload_dir || path.join(process.cwd(), "static")

    // Since there is no way to serve private files through a static server, we simply place them in `static`.
    // This means that the files will be available publicly if the filename is known. Since the local file provider
    // is for development only, this shouldn't be an issue. If you really want to use it in production (and you shouldn't)
    // You can change the private upload dir to `/private` but none of the functionalities where you use a presigned URL will work.
    this.privateUploadDir_ =
      options?.private_upload_dir || path.join(process.cwd(), "static")
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
    const baseDir =
      file.access === "public" ? this.uploadDir_ : this.privateUploadDir_
    const dir = await this.ensureDirExists(baseDir, parsedFilename.dir)

    const fileKey = path.join(
      parsedFilename.dir,
      // We prepend "private" to the file key so deletions and presigned URLs can know which folder to look into
      `${file.access === "public" ? "" : "private-"}${Date.now()}-${
        parsedFilename.base
      }`
    )

    const filePath = this.getUploadFilePath(baseDir, fileKey)
    const fileUrl = this.getUploadFileUrl(fileKey)

    const content = Buffer.from(file.content as string, "binary")
    await fs.writeFile(filePath, content)

    return {
      key: fileKey,
      url: fileUrl,
    }
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    const baseDir = file.fileKey.startsWith("private-")
      ? this.privateUploadDir_
      : this.uploadDir_

    const filePath = this.getUploadFilePath(baseDir, file.fileKey)
    try {
      await fs.access(filePath, fs.constants.F_OK)
      await fs.unlink(filePath)
    } catch (e) {
      // The file does not exist, so it's a noop.
    }

    return
  }

  // For private files, we simply return the file path, which can then be loaded manually by the backend.
  // The local file provider doesn't support presigned URLs for private files (i.e files not placed in /static).
  async getPresignedDownloadUrl(
    file: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    const isPrivate = file.fileKey.startsWith("private-")
    const baseDir = isPrivate ? this.privateUploadDir_ : this.uploadDir_

    const filePath = this.getUploadFilePath(baseDir, file.fileKey)

    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `File with key ${file.fileKey} not found`
      )
    }

    if (isPrivate) {
      return filePath
    }

    return this.getUploadFileUrl(file.fileKey)
  }

  private getUploadFilePath = (baseDir: string, fileKey: string) => {
    return path.join(baseDir, fileKey)
  }

  private getUploadFileUrl = (fileKey: string) => {
    const baseUrl = new URL(this.backendUrl_)
    baseUrl.pathname = path.join(baseUrl.pathname, fileKey)
    return baseUrl.href
  }

  private async ensureDirExists(baseDir: string, dirPath: string) {
    const relativePath = path.join(baseDir, dirPath)
    try {
      await fs.access(relativePath, fs.constants.F_OK)
    } catch (e) {
      await fs.mkdir(relativePath, { recursive: true })
    }

    return relativePath
  }
}
