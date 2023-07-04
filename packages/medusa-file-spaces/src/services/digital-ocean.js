import { AbstractFileService } from "@medusajs/medusa"
import aws from "aws-sdk"
import fs from "fs"
import { parse } from "path"
import stream from "stream"

class DigitalOceanService extends AbstractFileService {
  constructor({}, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.spacesUrl_ = options.spaces_url?.replace(/\/$/, "")
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
    this.downloadUrlDuration = options.download_url_duration ?? 60 // 60 seconds
  }

  upload(file) {
    this.updateAwsConfig()

    return this.uploadFile(file)
  }

  uploadProtected(file) {
    this.updateAwsConfig()

    return this.uploadFile(file, { acl: "private" })
  }

  uploadFile(file, options = { isProtected: false, acl: undefined }) {
    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const s3 = new aws.S3()
    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        if (this.spacesUrl_) {
          resolve({ url: `${this.spacesUrl_}/${data.Key}`, key: data.Key })
        }

        resolve({ url: data.Location, key: data.Key })
      })
    })
  }

  async delete(file) {
    this.updateAwsConfig()

    const s3 = new aws.S3()
    const params = {
      Bucket: this.bucket_,
      Key: `${file}`,
    }

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  async getUploadStreamDescriptor(fileData) {
    this.updateAwsConfig()

    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}.${fileData.ext}`
    const params = {
      ACL: fileData.acl ?? "private",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
    }

    const s3 = new aws.S3()
    return {
      writeStream: pass,
      promise: s3.upload(params).promise(),
      url: `${this.spacesUrl_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(fileData) {
    this.updateAwsConfig()

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return s3.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(fileData) {
    this.updateAwsConfig({
      signatureVersion: "v4",
    })

    const s3 = new aws.S3()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    }

    return await s3.getSignedUrlPromise("getObject", params)
  }

  updateAwsConfig(additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
        region: this.region_,
        endpoint: this.endpoint_,
        ...additionalConfiguration,
      },
      true
    )
  }
}

export default DigitalOceanService
