import fs from "fs"
import aws from "aws-sdk"
import { parse } from "path"
import {
  AbstractFileService,
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  IFileService,
  UploadStreamDescriptorType,
} from "@medusajs/medusa"
import stream from "stream"
import { PutObjectRequest } from "aws-sdk/clients/s3"
import { ClientConfiguration } from "aws-sdk/clients/s3"

class S3Service extends AbstractFileService implements IFileService {
  protected bucket_: string
  protected s3Url_: string
  protected accessKeyId_: string
  protected secretAccessKey_: string
  protected region_: string
  protected endpoint_: string
  protected awsConfigObject_: any
  protected downloadFileDuration_: string

  constructor({}, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.s3Url_ = options.s3_url
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
    this.downloadFileDuration_ = options.download_file_duration
    this.awsConfigObject_ = options.aws_config_object ?? {}
  }

  protected getClient(overwriteConfig: Partial<ClientConfiguration> = {}) {
    const config: ClientConfiguration = {
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      region: this.region_,
      endpoint: this.endpoint_,
      ...this.awsConfigObject_,
      ...overwriteConfig,
    }

    return new aws.S3(config)
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
    const client = this.getClient()

    const parsedFilename = parse(file.originalname)

    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: file.mimetype,
    }

    const result = await client.upload(params).promise()

    return {
      url: result.Location,
      key: result.Key,
    }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const client = this.getClient()

    const params = {
      Bucket: this.bucket_,
      Key: `${file}`,
    }

    return new Promise((resolve, reject) => {
      client.deleteObject(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async getUploadStreamDescriptor(fileData: UploadStreamDescriptorType) {
    const client = this.getClient()
    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}.${fileData.ext}`
    const params: PutObjectRequest = {
      ACL: fileData.acl ?? "private",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
      ContentType: fileData.contentType as string,
    }

    return {
      writeStream: pass,
      promise: client.upload(params).promise(),
      url: `${this.s3Url_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(
    fileData: GetUploadedFileType
  ): Promise<NodeJS.ReadableStream> {
    const client = this.getClient()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return await client.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(
    fileData: GetUploadedFileType
  ): Promise<string> {
    const client = this.getClient({ signatureVersion: "v4" })

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadFileDuration_,
    }

    return await client.getSignedUrlPromise("getObject", params)
  }
}

export default S3Service
