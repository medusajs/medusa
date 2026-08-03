import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
  S3ClientConfigType,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {
  FileTypes,
  Logger,
  S3FileServiceOptions,
} from "@medusajs/framework/types"
import {
  AbstractFileProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import path from "path"
import { PassThrough, Readable, Writable } from "stream"
import { ulid } from "ulid"

/**
 * Decodes the string `content` of an uploaded file into a Buffer.
 *
 * Upload inputs arrive as a string that may be base64, UTF-8 text (e.g. a CSV
 * with special characters, see #13649) or a binary/latin1 string (e.g. an image
 * produced via `buffer.toString("binary")`, as the upload docs instruct).
 * Decoding a binary string as UTF-8 corrupts every byte > 127 (a PNG's leading
 * `0x89` becomes `0xC2 0x89`), so the encoding is chosen from the file's MIME
 * type, defaulting to binary for non-text content.
 */
function decodeFileContent(content: string, mimeType?: string): Buffer {
  const decodedBase64 = Buffer.from(content, "base64")
  if (decodedBase64.toString("base64") === content) {
    return decodedBase64
  }

  const isTextContent =
    mimeType?.startsWith("text/") ||
    mimeType?.includes("csv") ||
    mimeType?.includes("json") ||
    mimeType?.includes("xml")

  return isTextContent
    ? Buffer.from(content, "utf8")
    : Buffer.from(content, "binary")
}


/**
 * Sanitizes a file path by:
 * - Normalizing slashes to posix format
 * - Stripping leading slashes
 * - Resolving relative path segments (.)
 * - Removing path traversal segments (..)
 */
function sanitizeFilePath(filePath: string): string {
  const cleanPath = filePath.replace(/\\/g, "/").replace(/^\/+/, "")
  const normalizedPath = path.posix.normalize(cleanPath)
  return normalizedPath
    .split("/")
    .filter((segment) => segment !== ".." && segment !== ".")
    .join("/")
}

type InjectedDependencies = {
  logger: Logger
}

interface S3FileServiceConfig {
  fileUrl: string
  accessKeyId?: string
  secretAccessKey?: string
  sessionToken?: string
  authenticationMethod?: "access-key" | "s3-iam-role"
  region: string
  bucket: string
  prefix?: string
  endpoint?: string
  cacheControl?: string
  downloadFileDuration?: number
  additionalClientConfig?: Record<string, any>
  acl?: ObjectCannedACL | false
}

const DEFAULT_UPLOAD_EXPIRATION_DURATION_SECONDS = 60 * 60

export class S3FileService extends AbstractFileProviderService {
  static identifier = "s3"
  protected config_: S3FileServiceConfig
  protected logger_: Logger
  protected client_: S3Client

  constructor({ logger }: InjectedDependencies, options: S3FileServiceOptions) {
    super()

    const authenticationMethod = options.authentication_method ?? "access-key"

    if (
      authenticationMethod === "access-key" &&
      (!options.access_key_id || !options.secret_access_key)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Access key ID and secret access key are required when using access key authentication`
      )
    }

    this.config_ = {
      fileUrl: options.file_url,
      accessKeyId: options.access_key_id,
      secretAccessKey: options.secret_access_key,
      sessionToken: options.session_token,
      authenticationMethod: authenticationMethod,
      region: options.region,
      bucket: options.bucket,
      prefix: options.prefix ?? "",
      endpoint: options.endpoint,
      cacheControl: options.cache_control ?? "public, max-age=31536000",
      downloadFileDuration: options.download_file_duration ?? 60 * 60,
      additionalClientConfig: options.additional_client_config ?? {},
      acl: options.acl ?? undefined,
    }
    this.logger_ = logger
    this.client_ = this.getClient()
  }

  protected getClient() {
    // If none is provided, the SDK will use the default credentials provider chain, see https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-envvars.html
    const credentials =
      this.config_.authenticationMethod === "access-key"
        ? {
          accessKeyId: this.config_.accessKeyId!,
          secretAccessKey: this.config_.secretAccessKey!,
          sessionToken: this.config_.sessionToken,
        }
        : undefined

    const config: S3ClientConfigType = {
      credentials,
      region: this.config_.region,
      endpoint: this.config_.endpoint,
      ...this.config_.additionalClientConfig,
    }

    return new S3Client(config)
  }

  /**
   * Resolves the ACL to use for an upload. Returns undefined if ACLs are
   * disabled (config_.acl === false), which causes the SDK to omit the
   * ACL header entirely — required for buckets with BucketOwnerEnforced
   * Object Ownership or Block Public Access enabled.
   *
   * Note: getPresignedUploadUrl only calls this when `access` is explicitly
   * provided. When access is undefined, presigned uploads omit ACL entirely
   * (preserving original behaviour). The `acl` config option targets
   * server-side uploads (upload/getUploadStream) where we control the
   * PutObject call directly.
   */
  protected resolveAcl(
    access?: "public" | "private"
  ): ObjectCannedACL | undefined {
    if (this.config_.acl === false) {
      return undefined
    }
    if (this.config_.acl) {
      return this.config_.acl
    }
    return access === "public" ? "public-read" : "private"
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

    const sanitizedPath = sanitizeFilePath(file.filename)
    if (!sanitizedPath) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid filename: ${file.filename}`
      )
    }
    const parsedFilename = path.posix.parse(sanitizedPath)

    // TODO: Allow passing a full path for storage per request, not as a global config.
    const fileKey = `${this.config_.prefix}${parsedFilename.dir ? `${parsedFilename.dir}/` : ""}${parsedFilename.name}-${ulid()}${parsedFilename.ext
      }`

    const content = decodeFileContent(file.content, file.mimeType)

    const command = new PutObjectCommand({
      // We probably also want to support a separate bucket altogether for private files
      // protected private_bucket_: string
      // protected private_access_key_id_: string
      // protected private_secret_access_key_: string

      ACL: this.resolveAcl(file.access as "public" | "private"),
      Bucket: this.config_.bucket,
      Body: content,
      Key: fileKey,
      ContentType: file.mimeType,
      CacheControl: this.config_.cacheControl,
      // Note: We could potentially set the content disposition when uploading,
      // but storing the original filename as metadata should suffice.
      Metadata: {
        "original-filename": encodeURIComponent(file.filename),
      },
    })

    try {
      await this.client_.send(command)
    } catch (e) {
      this.logger_.error(e)
      throw e
    }

    const encodedKey = fileKey
      .split("/")
      .map(encodeURIComponent)
      .join("/")

    return {
      url: `${this.config_.fileUrl}/${encodedKey}`,
      key: fileKey,
    }
  }

  async getUploadStream(fileData: FileTypes.ProviderUploadStreamDTO): Promise<{
    writeStream: Writable
    promise: Promise<FileTypes.ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    if (!fileData.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No filename provided`
      )
    }

    const sanitizedPath = sanitizeFilePath(fileData.filename)
    if (!sanitizedPath) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid filename: ${fileData.filename}`
      )
    }
    const parsedFilename = path.posix.parse(sanitizedPath)
    const fileKey = `${this.config_.prefix}${parsedFilename.dir ? `${parsedFilename.dir}/` : ""}${parsedFilename.name}-${ulid()}${parsedFilename.ext
      }`

    const pass = new PassThrough()
    const upload = new Upload({
      client: this.client_,
      params: {
        ACL: this.resolveAcl(fileData.access as "public" | "private"),
        Bucket: this.config_.bucket,
        Key: fileKey,
        Body: pass,
        ContentType: fileData.mimeType,
        CacheControl: this.config_.cacheControl,
        Metadata: {
          "original-filename": encodeURIComponent(fileData.filename),
        },
      },
    })

    const encodedKey = fileKey
      .split("/")
      .map(encodeURIComponent)
      .join("/")

    const promise = upload.done().then(() => ({
      url: `${this.config_.fileUrl}/${encodedKey}`,
      key: fileKey,
    }))

    return {
      writeStream: pass,
      promise,
      url: `${this.config_.fileUrl}/${encodedKey}`,
      fileKey,
    }
  }

  async delete(
    files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]
  ): Promise<void> {
    try {
      /**
       * Bulk delete files
       */
      if (Array.isArray(files)) {
        await this.client_.send(
          new DeleteObjectsCommand({
            Bucket: this.config_.bucket,
            Delete: {
              Objects: files.map((file) => ({
                Key: file.fileKey,
              })),
              Quiet: true,
            },
          })
        )
      } else {
        await this.client_.send(
          new DeleteObjectCommand({
            Bucket: this.config_.bucket,
            Key: files.fileKey,
          })
        )
      }
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

    return await getSignedUrl(this.client_ as any, command as any, {
      expiresIn: this.config_.downloadFileDuration,
    })
  }

  // Note: Some providers (eg. AWS S3) allows IAM policies to further restrict what can be uploaded.
  async getPresignedUploadUrl(
    fileData: FileTypes.ProviderGetPresignedUploadUrlDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!fileData?.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No filename provided`
      )
    }

    const sanitizedFilename = sanitizeFilePath(fileData.filename)
    if (!sanitizedFilename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid filename: ${fileData.filename}`
      )
    }
    const fileKey = `${this.config_.prefix}${sanitizedFilename}`

    const acl = fileData.access
      ? this.resolveAcl(fileData.access as "public" | "private")
      : undefined

    // Using content-type, acl, etc. doesn't work with all providers, and some simply ignore it.
    const command = new PutObjectCommand({
      Bucket: this.config_.bucket,
      ContentType: fileData.mimeType,
      ACL: acl,
      Key: fileKey,
    })

    const signedUrl = await getSignedUrl(this.client_ as any, command as any, {
      expiresIn:
        fileData.expiresIn ?? DEFAULT_UPLOAD_EXPIRATION_DURATION_SECONDS,
    })

    return {
      url: signedUrl,
      key: fileKey,
    }
  }

  async getDownloadStream(
    file: FileTypes.ProviderGetFileDTO
  ): Promise<Readable> {
    if (!file?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No fileKey provided`
      )
    }

    const fileKey = file.fileKey
    const response = await this.client_.send(
      new GetObjectCommand({
        Key: fileKey,
        Bucket: this.config_.bucket,
      })
    )

    return response.Body! as Readable
  }

  async getAsBuffer(file: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    if (!file?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No fileKey provided`
      )
    }

    const fileKey = file.fileKey
    const response = await this.client_.send(
      new GetObjectCommand({
        Key: fileKey,
        Bucket: this.config_.bucket,
      })
    )

    return Buffer.from(await response.Body!.transformToByteArray())
  }
}
