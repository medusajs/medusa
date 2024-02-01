import fs from "fs"
import type { S3ClientConfigType, PutObjectCommandInput, GetObjectCommandOutput } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3"
import { parse } from "path"
import { AbstractFileService, IFileService } from "@medusajs/medusa"
import {
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
  Logger
} from "@medusajs/types"
import stream from "stream"

class S3Service extends AbstractFileService implements IFileService {
  protected prefix_: string
  protected bucket_: string
  protected s3Url_: string
  protected accessKeyId_: string
  protected secretAccessKey_: string
  protected region_: string
  protected awsConfigObject_: any
  protected downloadFileDuration_: number
  protected cacheControl_: string
  protected logger_: Logger
  protected client_: S3Client

  constructor({ logger }, options) {
    super(arguments[0], options)

    this.prefix_ = options.prefix ? `${options.prefix}/` : ''
    this.bucket_ = options.bucket
    this.s3Url_ = options.s3_url
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.downloadFileDuration_ = options.download_file_duration
    this.awsConfigObject_ = options.aws_config_object ?? {}
    this.cacheControl_ = options.cache_control ?? "max-age=31536000"
    this.logger_ = logger
    this.client_ = this.getClient()
  }

  protected getClient(overwriteConfig: Partial<S3ClientConfigType> = {}) {
    const config: S3ClientConfigType = {
      credentials: {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
      },
      region: this.region_,
      ...this.awsConfigObject_,
      signatureVersion: 'v4',
      ...overwriteConfig,
    }

    return new S3Client(config)
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(file: Express.Multer.File) {
    return await this.uploadFile(file, { acl: "private" })
  }

  async uploadFile(
    file: Express.Multer.File,
    options: { isProtected?: boolean; acl?: string } = {
      isProtected: false,
      acl: undefined,
    }
  ) {

    const parsedFilename = parse(file.originalname)

    const fileKey = `${this.prefix_}${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const command = new PutObjectCommand({
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: file.mimetype,
      CacheControl: this.cacheControl_
    })

    try {
      await this.client_.send(command)
      return {
        url: `${this.s3Url_}/${fileKey}`,
        key: fileKey,
      }
    } catch (e) {
      this.logger_.error(e)
      throw e
    }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket_,
      Key: `${file.file_key}`,
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      this.logger_.error(e)
    }
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    const pass = new stream.PassThrough()

    const isPrivate = fileData.isPrivate ?? true // default to private

    const fileKey = `${this.prefix_}${fileData.name}.${fileData.ext}`
    const params: PutObjectCommandInput = {
      ACL: isPrivate ? "private" : "public-read",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
      ContentType: fileData.contentType as string,
    }

    const uploadJob = new Upload({
      client: this.client_,
      params
    })

    return {
      writeStream: pass,
      promise: uploadJob.done(),
      url: `${this.s3Url_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const command = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    })

    const response: GetObjectCommandOutput = await this.client_.send(command)

    return response.Body as NodeJS.ReadableStream
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    })

    return await getSignedUrl(this.client_, command, { expiresIn: this.downloadFileDuration_ })
  }
}

export default S3Service
