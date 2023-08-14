import fs from "fs"
import stream from "stream"
import { parse } from "path"
import type { S3ClientConfigType, PutObjectCommandOutput, GetObjectCommandOutput } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand 
} from "@aws-sdk/client-s3"
import {
   AbstractFileService,
   DeleteFileType,
   FileServiceUploadResult,
   GetUploadedFileType,
   IFileService,
   Logger,
   UploadStreamDescriptorType,
} from "@medusajs/medusa"

class S3Service extends AbstractFileService implements IFileService {
  protected s3Url_: string
  protected region_: string
  protected bucket_: string
  protected accessKeyId_: string
  protected secretAccessKey_: string
  protected awsConfigObject_: any
  protected cacheControl_: string
  protected downloadFileDuration_: number
  protected client: S3Client
  protected logger_: Logger

  constructor({logger}, options) {
    super({}, options)

    this.s3Url_ = options.s3_url
    this.region_ = options.region
    this.bucket_ = options.bucket
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.awsConfigObject_ = options.aws_config_object ?? {}
    this.cacheControl_ = options.cache_control ?? "max-age=31536000"
    this.downloadFileDuration_ = options.download_file_duration ?? 3600
    this.logger_ = logger

    const config: S3ClientConfigType = {
      credentials: {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
      },
      region: this.region_,
      ...this.awsConfigObject_,
      signatureVersion: 'v4'
    }
  
    this.client = new S3Client(config)
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
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const command = new PutObjectCommand({
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Key: fileKey,
      Body: fs.createReadStream(file.path),
      ContentType: file.mimetype,
      CacheControl: this.cacheControl_
    })

    try {
      await this.client.send(command)
      return {
        url: `${this.s3Url_}/${fileKey}`,
        key: fileKey,
      }
    } catch (e) {
      this.logger_.error(e)
      throw(e) // rejects the promise
    }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket_,
      Key: `${file.file_key}`,
    })

    try {
      const response = await this.client.send(command)
      console.log(response)
    } catch (e) {
      this.logger_.error(e)
    }
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    const pass = new stream.PassThrough()
    const fileKey = `${fileData.name}.${fileData.ext}`

    const uploadJob = new Upload({
      client: this.client,
      params: {
        ACL: fileData.acl ?? "private",
        Bucket: this.bucket_,
        Key: fileKey,
        Body: pass,
        ContentType: fileData.contentType as string
      }
    })

    return {
      writeStream: pass,
      promise: uploadJob.done(),
      url: `${this.s3Url_}/${fileKey}`,
      fileKey
    }
  }

  async getDownloadStream(fileData: GetUploadedFileType): Promise<NodeJS.ReadableStream> {
    const command = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    })

    const response: GetObjectCommandOutput = await this.client.send(command)

    return response.Body as NodeJS.ReadableStream
  }

  async getPresignedDownloadUrl(fileData: GetUploadedFileType): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`
    })

    return await getSignedUrl(this.client, command, { expiresIn: this.downloadFileDuration_ })
  }
}

export default S3Service
