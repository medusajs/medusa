import { AbstractFileService, IFileService } from "@medusajs/medusa"
import {
  DeleteFileType,
  FileServiceUploadResult,
  GetUploadedFileType,
  UploadStreamDescriptorType,
} from "@medusajs/types"
import { ClientConfiguration, PutObjectRequest } from "aws-sdk/clients/s3"

import { MedusaError } from "medusa-core-utils"
import aws from "aws-sdk"
import fs from "fs"
import { parse } from "path"
import stream from "stream"

class MinioService extends AbstractFileService implements IFileService {
  protected bucket_: string
  protected accessKeyId_: string
  protected secretAccessKey_: string
  protected private_bucket_: string
  protected private_access_key_id_: string
  protected private_secret_access_key_: string
  protected endpoint_: string
  protected s3ForcePathStyle_: boolean
  protected signatureVersion_: string
  protected downloadUrlDuration: string | number

  constructor({}, options) {
    super(arguments[0], options)

    this.bucket_ = options.bucket
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.private_bucket_ = options.private_bucket
    this.private_access_key_id_ =
      options.private_access_key_id ?? this.accessKeyId_
    this.private_secret_access_key_ =
      options.private_secret_access_key ?? this.secretAccessKey_
    this.endpoint_ = options.endpoint
    this.s3ForcePathStyle_ = true
    this.signatureVersion_ = "v4"
    this.downloadUrlDuration = options.download_url_duration ?? 60 // 60 seconds
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

    const params = {
      ACL: options.isProtected ? "private" : "public-read",
      Bucket: options.isProtected ? this.private_bucket_ : this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
      ContentType: file.mimetype,
    }

    const result = await client.upload(params).promise()

    return { url: result.Location, key: result.Key }
  }

  async delete(file: DeleteFileType): Promise<void> {
    const privateClient = this.getClient(false)
    const publicClient = this.getClient(true)

    const params = {
      Bucket: this.bucket_,
      Key: `${file.fileKey}`,
    }

    await Promise.all([
      new Promise((resolve, reject) =>
        publicClient.deleteObject(
          { ...params, Bucket: this.bucket_ },
          (err, data) => {
            if (err) {
              reject(err)
              return
            }
            resolve(data)
          }
        )
      ),
      new Promise((resolve, reject) =>
        privateClient.deleteObject(
          { ...params, Bucket: this.private_bucket_ },
          (err, data) => {
            if (err) {
              reject(err)
              return
            }
            resolve(data)
          }
        )
      ),
    ])
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

    const params: PutObjectRequest = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Body: pass,
      Key: fileKey,
      ContentType: fileData.contentType,
    }

    return {
      writeStream: pass,
      promise: client.upload(params).promise(),
      url: this.buildUrl(params.Bucket, fileKey),
      fileKey,
    }
  }

  async getDownloadStream(fileData: GetUploadedFileType) {
    const usePrivateBucket = fileData.isPrivate ?? true
    this.validatePrivateBucketConfiguration_(usePrivateBucket)
    const client = this.getClient(usePrivateBucket)

    const params = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return client.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl({
    isPrivate = true,
    ...fileData
  }: GetUploadedFileType) {
    this.validatePrivateBucketConfiguration_(isPrivate)
    const client = this.getClient(isPrivate, {
      signatureVersion: "v4",
    })

    const params = {
      Bucket: isPrivate ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    }

    return await client.getSignedUrlPromise("getObject", params)
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
    additionalConfiguration: Partial<ClientConfiguration> = {}
  ) {
    return new aws.S3({
      accessKeyId: usePrivateBucket
        ? this.private_access_key_id_
        : this.accessKeyId_,
      secretAccessKey: usePrivateBucket
        ? this.private_secret_access_key_
        : this.secretAccessKey_,
      endpoint: this.endpoint_,
      s3ForcePathStyle: this.s3ForcePathStyle_,
      signatureVersion: this.signatureVersion_,
      ...additionalConfiguration,
    })
  }
}

export default MinioService
