import { AbstractFileService, IFileService } from "@medusajs/medusa"
import {
  FileServiceGetUploadStreamResult,
  FileServiceUploadResult,
  UploadStreamDescriptorType,
} from "@medusajs/types"

import fs from "fs"
import path from "path"
import stream from "stream"

class LocalService extends AbstractFileService implements IFileService {
  protected uploadDir_: string
  protected backendUrl_: string
  protected storageType_: "flat" | "byDate"

  constructor({}, options) {
    super(arguments[0], options)

    this.uploadDir_ = options.upload_dir || "uploads"
    this.backendUrl_ = options.backend_url || "http://localhost:9000"
    this.storageType_ = options.storageType || "flat"
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file, {})
  }

  async uploadFile(
    file: Express.Multer.File,
    options = {}
  ): Promise<FileServiceUploadResult> {
    const parsedFilename = path.parse(file.originalname)
    const fileKey = this.genFileKey(parsedFilename)

    return new Promise((resolve, reject) => {
      fs.copyFile(file.path, `${this.uploadDir_}/${fileKey}`, (err) => {
        if (err) {
          reject(err)
          throw err
        }

        const fileUrl = `${this.backendUrl_}/${this.uploadDir_}/${fileKey}`

        resolve({ url: fileUrl, key: fileKey })
      })
    })
  }

  async delete(file): Promise<void> {
    const filePath = `${this.uploadDir_}/${file.fileKey}`
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType
  ): Promise<FileServiceGetUploadStreamResult> {
    const parsedFilename = path.parse(
      fileData.name + (fileData.ext ? `.${fileData.ext}` : "")
    )
    const fileKey = this.genFileKey(parsedFilename)

    const fileUrl = `${this.backendUrl_}/${this.uploadDir_}/${fileKey}`

    const pass = new stream.PassThrough()
    const writeStream = fs.createWriteStream(`${this.uploadDir_}/${fileKey}`)

    pass.pipe(writeStream) // for consistency with the IFileService

    const promise = new Promise((res, rej) => {
      writeStream.on("finish", res)
      writeStream.on("error", rej)
    })

    return { url: fileUrl, fileKey, writeStream: pass, promise }
  }

  async getDownloadStream(fileData): Promise<NodeJS.ReadableStream> {
    const filePath = `${this.uploadDir_}/${fileData.fileKey}`
    return fs.createReadStream(filePath)
  }

  async getPresignedDownloadUrl(fileData): Promise<string> {
    return `${this.backendUrl_}/${this.uploadDir_}/${fileData.fileKey}`
  }

  /**
   * Ensure `uploadDir_` has nested directories provided as file path
   *
   * @param dirPath - file path relative to the base directory
   * @private
   */
  private ensureDirExists(dirPath: string) {
    const relativePath = path.join(this.uploadDir_, dirPath)

    if (!fs.existsSync(relativePath)) {
      fs.mkdirSync(relativePath, { recursive: true })
    }
  }

  genFileKey(parsedFilename: path.ParsedPath) {
    const extraDir =
      this.storageType_ === "byDate" ? this.getFileDirByDate() : ""

    const dirPath = path.join(parsedFilename.dir, extraDir)
    this.ensureDirExists(dirPath)
    const fileKey = path.join(dirPath, `${Date.now()}-${parsedFilename.base}`)
    return fileKey
  }

  getFileDirByDate() {
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")

    const formattedDate = `${year}/${month}/${day}/`
    return formattedDate
  }
}

export default LocalService
