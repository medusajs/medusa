import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfigType,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { FileTypes, Logger, S3FileServiceOptions } from "@medusajs/types"
import { AbstractFileProviderService, MedusaError } from "@medusajs/utils"
import path from "path"
import { ulid } from "ulid"

type InjectedDependencies = {
  logger: Logger
}

interface S3FileServiceConfig {
  // TODO: We probably don't need this as either the service should return it or we should be able to calculate it.
  fileUrl: string
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
  prefix?: string
  endpoint?: string
  cacheControl?: string
  downloadFileDuration?: number
  additionalClientConfig?: Record<string, any>
}

// FUTURE: At one point we will probably need to support authenticating with IAM roles instead.
export class S3FileService extends AbstractFileProviderService {
  static identifier = "s3"
  protected config_: S3FileServiceConfig
  protected logger_: Logger
  protected client_: S3Client

  constructor({ logger }: InjectedDependencies, options: S3FileServiceOptions) {
    super()

    this.config_ = {
      fileUrl: options.file_url,
      accessKeyId: options.access_key_id,
      secretAccessKey: options.secret_access_key,
      region: options.region,
      bucket: options.bucket,
      prefix: options.prefix ?? "",
      endpoint: options.endpoint,
      cacheControl: options.cache_control ?? "public, max-age=31536000",
      downloadFileDuration: options.download_file_duration ?? 60 * 60,
      additionalClientConfig: options.additional_client_config ?? {},
    }
    this.logger_ = logger
    this.client_ = this.getClient()
  }

  protected getClient() {
    const config: S3ClientConfigType = {
      credentials: {
        accessKeyId: this.config_.accessKeyId,
        secretAccessKey: this.config_.secretAccessKey,
      },
      region: this.config_.region,
      endpoint: this.config_.endpoint,
      ...this.config_.additionalClientConfig,
    }

    return new S3Client(config)
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

    // TODO: Allow passing a full path for storage per request, not as a global config.
    const fileKey = `${this.config_.prefix}${parsedFilename.name}-${ulid()}${
      parsedFilename.ext
    }`

    const content = Buffer.from(file.content, "binary")
    const command = new PutObjectCommand({
      // We probably also want to support a separate bucket altogether for private files
      // protected private_bucket_: string
      // protected private_access_key_id_: string
      // protected private_secret_access_key_: string

      ACL: file.access === "public" ? "public-read" : "private",
      Bucket: this.config_.bucket,
      Body: content,
      Key: fileKey,
      ContentType: file.mimeType,
      CacheControl: this.config_.cacheControl,
      // Note: We could potentially set the content disposition when uploading,
      // but storing the original filename as metadata should suffice.
      Metadata: {
        "x-amz-meta-original-filename": file.filename,
      },
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      this.logger_.error(e)
      throw e
    }

    return {
      url: `${this.config_.fileUrl}/${fileKey}`,
      key: fileKey,
    }
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config_.bucket,
      Key: file.fileKey,
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      // TODO: Rethrow depending on the error (eg. a file not found error is fine, but a failed request should be rethrown)
      this.logger_.error(e)
    }
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    // TODO: Allow passing content disposition when getting a presigned URL
    const command = new GetObjectCommand({
      Bucket: this.config_.bucket,
      Key: `${fileData.fileKey}`,
    })

    return await getSignedUrl(this.client_, command, {
      expiresIn: this.config_.downloadFileDuration,
    })
  }
}
