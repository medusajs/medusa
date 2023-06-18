import {
  AbstractFileService,
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  IFileService,
  GetUploadedFileType,
  UploadStreamDescriptorType,
  DeleteFileType,
} from "@medusajs/medusa"
import fs from "fs"
import fsp from "fs/promises"
import stream from "stream"
import path from "path"

import { LocalFilePluginOptions } from "../types"

class LocalService extends AbstractFileService implements IFileService {
  protected uploadDir_: string
  protected backendUrl_: string

  constructor({}, options: LocalFilePluginOptions = {}) {
    super({})

    this.uploadDir_ = options.upload_dir || "uploads/images"
    this.backendUrl_ = options.backend_url || "http://localhost:9000"
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file)
  }

  protected async uploadFile(
    file: Express.Multer.File
  ): Promise<{ url: string }> {
    const parsedFilename = path.parse(file.originalname)

    const fileKey = this.buildFileKey(
      `${parsedFilename.name}-${Date.now()}`,
      parsedFilename.ext
    )

    await fsp.copyFile(file.path, this.buildFilePath(fileKey))

    return { url: this.buildUrl(fileKey) }
  }

  async delete(file: DeleteFileType): Promise<void> {
    return fsp.unlink(this.buildFilePath(file.fileKey))
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const fileKey = this.buildFileKey(fileData.name, fileData.ext)
    const filePath = this.buildFilePath(fileKey)
    const url = this.buildUrl(fileKey)

    const directoryPath = path.dirname(filePath)
    await fsp.mkdir(directoryPath, { recursive: true })

    const writeStream = fs.createWriteStream(filePath)
    const pass = new stream.PassThrough()

    return {
      writeStream: pass,
      promise: stream.promises.pipeline(pass, writeStream),
      url,
      fileKey,
    }
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    return fs.createReadStream(this.buildFilePath(fileData.fileKey))
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    return this.buildUrl(fileData.fileKey)
  }

  protected buildFileKey(name: string, ext?: string) {
    if (!ext) return name

    return ext.startsWith(".") ? `${name}${ext}` : `${name}.${ext}`
  }

  protected buildFilePath(fileKey: string) {
    // Prevent path traversal
    const safeFileKey = path.normalize(fileKey).replace(/^(\.\.(\/|\\|$))+/, "")
    return path.join(this.uploadDir_, safeFileKey)
  }

  protected buildUrl(fileKey: string) {
    return `${this.backendUrl_}/${this.buildFilePath(fileKey)}`
  }
}

export default LocalService
