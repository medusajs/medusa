import stream from "stream"
import aws from "aws-sdk"
import { parse } from "path"
import fs from "fs"
import { AbstractFileService } from "@medusajs/medusa"
import { MedusaError } from "medusa-core-utils"

class MinioService extends AbstractFileService {
  constructor({}, options) {
    super({}, options)

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
    this.downloadUrlDuration = options.download_url_duration ?? 60  // 60 seconds
  }

  upload(file) {
    this.updateAwsConfig_()

    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const s3 = new aws.S3()
    const params = {
      ACL: "public-read",
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    }

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        console.log(data, err)
        if (err) {
          reject(err)
          return
        }

        resolve({ url: data.Location })
      })
    })
  }

  async delete(file) {
    this.updateAwsConfig_()

    const s3 = new aws.S3()
    const params = {
      Key: `${file}`,
    }

    return await Promise.all(
      [
        s3.deleteObject({...params, Bucket: this.bucket_}, (err, data) => {
          if (err) {
            reject(err)
            return
          }
          resolve(data)
        }),
        s3.deleteObject({...params, Bucket: this.private_bucket_}, (err, data) => {
          if (err) {
            reject(err)
            return
          }
          resolve(data)
        })
      ]
    ) 
  }

  async getUploadStreamDescriptor({ usePrivateBucket = true, ...fileData }) {
    this.validatePrivateBucketConfiguration_(usePrivateBucket)
    this.updateAwsConfig_(usePrivateBucket)

    const pass = new stream.PassThrough()

    const fileKey = `${fileData.name}.${fileData.ext}`
    const params = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
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

  async getDownloadStream({ usePrivateBucket = true, ...fileData }) {
    this.validatePrivateBucketConfiguration_(usePrivateBucket)
    this.updateAwsConfig_(usePrivateBucket)

    const s3 = new aws.S3()

    const params = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return s3.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl({ usePrivateBucket = true, ...fileData }) {
    this.validatePrivateBucketConfiguration_(usePrivateBucket)
    this.updateAwsConfig_(usePrivateBucket, {
      signatureVersion: "v4",
    })

    const s3 = new aws.S3()

    const params = {
      Bucket: usePrivateBucket ? this.private_bucket_ : this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires:  this.downloadUrlDuration,
    }

    return await s3.getSignedUrlPromise("getObject", params)
  }

  validatePrivateBucketConfiguration_(usePrivateBucket) {
    if (usePrivateBucket && !this.private_bucket_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_CONFIGURATION,
        "Private bucket is not configured"
      )
    }
  }

  updateAwsConfig_(usePrivateBucket = false, additionalConfiguration = {}) {
    aws.config.setPromisesDependency(null)
    aws.config.update(
      {
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
      },
      true
    )
  }
}

export default MinioService
