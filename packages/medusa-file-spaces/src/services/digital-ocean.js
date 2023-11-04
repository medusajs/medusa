import { AbstractFileService } from "@medusajs/medusa";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
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
    return this.uploadFile(file)
  }

  uploadProtected(file) {
    return this.uploadFile(file, { acl: "private" })
  }

  async uploadFile(file, options = { isProtected: false, acl: undefined }) {
    const parsedFilename = parse(file.originalname)
    const fileKey = `${parsedFilename.name}-${Date.now()}${parsedFilename.ext}`

    const s3 = new S3(this.getAwsConfig())
    const params = {
      ACL: options.acl ?? (options.isProtected ? "private" : "public-read"),
      Bucket: this.bucket_,
      Body: fs.createReadStream(file.path),
      Key: fileKey,
    }

    const data = await new Upload({ client: s3, params }).done();
    if (this.spacesUrl_) {
      return { url: `${this.spacesUrl_}/${data.Key}`, key: data.Key };
    }
    return { url: data.Location, key: data.Key };
  }

  async delete(file) {
    const s3 = new S3(this.getAwsConfig())
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
    const pass = new stream.PassThrough()

    // default to private
    const isPrivate =
      typeof fileData.isPrivate === "undefined" ? true : fileData.isPrivate

    const fileKey = `${fileData.name}.${fileData.ext}`
    const params = {
      ACL: isPrivate ? "private" : "public-read",
      Bucket: this.bucket_,
      Body: pass,
      Key: fileKey,
    }

    const s3 = new S3(this.getAwsConfig())
    return {
      writeStream: pass,
      promise: new Upload({ client: s3, params }).done(),
      url: `${this.spacesUrl_}/${fileKey}`,
      fileKey,
    };
  }

  async getDownloadStream(fileData) {
    const s3 = new S3(this.getAwsConfig())

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
    }

    return s3.getObject(params).createReadStream()
  }

  async getPresignedDownloadUrl(fileData) {
    const s3 = new S3(this.getAwsConfig())

    const params = {
      Bucket: this.bucket_,
      Key: `${fileData.fileKey}`,
      Expires: this.downloadUrlDuration,
    }

    return await getSignedUrl(s3, new GetObjectCommand(params), {
      expiresIn: "/* add value from 'Expires' from v2 call if present, else remove */"
    });
  }

  getAwsConfig() {
    return {
      credentials: {
        accessKeyId: this.accessKeyId_,
        secretAccessKey: this.secretAccessKey_,
      },
      region: this.region_,
      endpoint: this.endpoint_,
    };
  }
}

export default DigitalOceanService
