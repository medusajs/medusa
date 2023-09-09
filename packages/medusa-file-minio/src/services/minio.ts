import { AbstractFileService, IFileService } from "@medusajs/medusa"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { MedusaError } from "medusa-core-utils"
import { Upload } from "@aws-sdk/lib-storage"
import { parse } from "path"
import stream from "stream"
import fs from "fs"
import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfigType,
} from "@aws-sdk/client-s3"
import {
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  Logger,
  UploadStreamDescriptorType,
} from "@medusajs/types"

class MinioService extends AbstractFileService implements IFileService {
  protected bucket_: string
  protected accessKeyId_: string
  protected secretAccessKey_: string
  protected private_bucket_: string
  protected private_access_key_id_: string
  protected private_secret_access_key_: string
  protected region_: string
  protected endpoint_: string
  protected s3ForcePathStyle_: boolean
  protected downloadUrlDuration_: string | number
  protected cacheControl_: string
  protected logger_: Logger

  constructor({ logger }, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = "us-east-1" // aws sdk v3 requires a region to work, but minio doesn't use region, so default to "us-east-1"
    this.private_bucket_ = options.private_bucket
    this.private_access_key_id_ =
      options.private_access_key_id ?? this.accessKeyId_
    this.private_secret_access_key_ =
      options.private_secret_access_key ?? this.secretAccessKey_
    this.endpoint_ = options.endpoint
    this.s3ForcePathStyle_ = true
    this.downloadUrlDuration_ = options.download_url_duration ?? 60 // 60 seconds
    this.cacheControl_ = options.cache_control ?? "max-age=36000"
    this.logger_ = logger
  }

  protected buildUrl(bucket: string, key: string) {
    return `${this.endpoint_}/${bucket}/${key}`
  }

  async upload(file: Express.Multer.File): Promise<FileServiceUploadResult> {
    return await this.uploadFile(file)
  }

  async uploadProtected(
    file: Express.Multer.File
  ): Promise<FileServiceUploadResult> {
    this.validatePrivateBucketConfiguration_(true)

    return await this.uploadFile(file, { isProtected: true })
  }

  protected async uploadFile(
    file: Express.Multer.File,
    options: { isProtected: boolean } = { isProtected: false }
  ) {
    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const client = this.getClient(options.isProtected)

    const command = new PutObjectCommand({
      ACL: options.isProtected ? "private" : "public-read",
      Bucket: options.isProtected ? this.private_bucket_ : this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: file.mimetype,
      CacheControl: this.cacheControl_
    } satisfies PutObjectCommandInput)

    try {
      await client.send(command)
      return {
        url: this.buildUrl(String(command.input.Bucket), fileKey),
        key: fileKey,
      }
    } catch (e) {
      this.logger_.error(e)
      throw e
    }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const privateClient = this.getClient(true)
    const publicClient = this.getClient(false)

    const commandPrivate = new DeleteObjectCommand({
      Bucket: this.private_bucket_,
      Key: `${file.file_key}`,
    })

    const commandPublic = new DeleteObjectCommand({
      Bucket: this.bucket_,
      Key: `${file.file_key}`,
    })

    try {
      await privateClient.send(commandPrivate)
      await publicClient.send(commandPublic)
    } catch (e) {
      this.logger_.error(e)
    }
  }

  async getUploadStreamDescriptor(
    fileData: UploadStreamDescriptorType & {
      contentType?: string
    }
  ) {
    const usePrivateBucket = fileData.isPrivate ?? true

    this.validatePrivateBucketConfiguration_(usePrivateBucket)

    const client = this.getClient(usePrivateBucket)

    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}.${fileData.ext}`

    const params: PutObjectCommandInput = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Body: pass,
      Key: fileKey,
      ContentType: fileData.contentType,
    } satisfies PutObjectCommandInput

    const uploadJob = new Upload({
      client: client,
      params
    })

    return {
      writeStream: pass,
      promise: uploadJob.done(),
      url: this.buildUrl(String(params.Bucket), fileKey),
      fileKey,
    }
  }

  async getDownloadStream(fileData: GetUploadedFileType) {
    const usePrivateBucket = fileData.isPrivate ?? true
    this.validatePrivateBucketConfiguration_(usePrivateBucket)
    const client = this.getClient(usePrivateBucket)

    const command = new GetObjectCommand({
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
    } satisfies GetObjectCommandInput)

    const response: GetObjectCommandOutput = await client.send(command)
    return response.Body as NodeJS.ReadableStream
  }

  async getPresignedDownloadUrl({
    isPrivate = true,
    ...fileData
  }: GetUploadedFileType) {
    this.validatePrivateBucketConfiguration_(isPrivate)
    const client = this.getClient(isPrivate)

    const command = new GetObjectCommand({
      Bucket: isPrivate ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
    } satisfies GetObjectCommandInput)

    return await getSignedUrl(client, command, { expiresIn: Number(this.downloadUrlDuration_) })
  }

  validatePrivateBucketConfiguration_(usePrivateBucket: boolean) {
    if (
      usePrivateBucket &&
      (!this.private_access_key_id_ || !this.private_bucket_)
    ) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Private bucket is not configured"
      )
    }
  }

  protected getClient(
    usePrivateBucket = false,
    additionalConfiguration: Partial<S3ClientConfigType> = {}
  ) {
    const config: S3ClientConfigType = {
      region: this.region_,
      credentials: {
        accessKeyId: usePrivateBucket
          ? this.private_access_key_id_
          : this.accessKeyId_,
        secretAccessKey: usePrivateBucket
          ? this.private_secret_access_key_
          : this.secretAccessKey_,
      },
      endpoint: this.endpoint_,
      forcePathStyle: this.s3ForcePathStyle_,
      ...additionalConfiguration,
    } satisfies S3ClientConfigType
    return new S3Client(config)
  }
}

export default MinioService
