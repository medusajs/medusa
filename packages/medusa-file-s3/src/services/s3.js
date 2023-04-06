import fs from "fs"
import aws from "aws-sdk"
import { parse } from "path"
import { AbstractFileService } from "@medusajs/medusa"
import stream from "stream"

class S3Service extends AbstractFileService {
  // eslint-disable-next-line no-empty-pattern
  constructor({}, options) {
    super({}, options)

    this.bucket_ = options.bucket
    this.s3Url_ = options.s3_url
    this.accessKeyId_ = options.access_key_id
    this.secretAccessKey_ = options.secret_access_key
    this.region_ = options.region
    this.endpoint_ = options.endpoint
    this.awsConfigObject_ = options.aws_config_object

    this.client_ = new aws.S3()
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

    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    }

    return new Promise((resolve, reject) => {
      this.client_.upload(params, (err, data) => {
        if (err) {
          reject(err)
          return
        }

        resolve({ url: data.Location, key: data.Key })
      })
    })
  }

  async delete(file) {
    this.updateAwsConfig()

    const params = {
      Bucket: this.bucket_,
      Key: `${file}`,
    }

    return new Promise((resolve, reject) => {
      this.client_.deleteObject(params, (err, data) => {
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

    return {
      writeStream: pass,
      promise: this.client_.upload(params).promise(),
      url: `${this.s3Url_}/${fileKey}`,
      fileKey,
    }
  }

  async getDownloadStream(fileData) {
    this.updateAwsConfig()

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return this.client_.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(fileData) {
    this.updateAwsConfig({
      signatureVersion: "v4",
    })

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    }

    return await this.client_.getSignedUrlPromise("getObject", params)
  }

  updateAwsConfig(additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)

    const config = {
      ...additionalConfiguration,
      accessKeyId: this.accessKeyId_,
      secretAccessKey: this.secretAccessKey_,
      region: this.region_,
      endpoint: this.endpoint_,
      ...this.awsConfigObject_,
    }

    aws.config.update(config, true)
  }
}

export default S3Service
