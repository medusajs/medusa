import stream from "stream"

/**
 * @interface
 * 
 * Details of a file upload's result.
 */
export type FileServiceUploadResult = {
  /**
   * The file's URL.
   */
  url: string
  /**
   * The file's key. This key is used in other operations,
   * such as deleting a file.
   */
  key: string
}

/**
 * @interface
 * 
 * The relevant details to upload a file through a stream.
 */
export type FileServiceGetUploadStreamResult = {
  /**
   * A [PassThrough](https://nodejs.org/api/stream.html#class-streampassthrough) write stream object to be used to write the file.
   */
  writeStream: stream.PassThrough
  /**
   * A promise that should resolved when the writing process is done to finish the upload.
   */
  promise: Promise<any>
  /**
   * The URL of the file once it’s uploaded.
   */
  url: string
  /**
   * The identifier of the file in the storage. For example, for a local file service, this can be the file's name.
   */
  fileKey: string
  [x: string]: unknown
}

/**
 * @interface
 * 
 * The details of a file to retrieve.
 */
export type GetUploadedFileType = {
  /**
   * The file's key.
   */
  fileKey: string
  /**
   * Whether the file is private.
   */
  isPrivate?: boolean
  [x: string]: unknown
}

/**
 * @interface
 * 
 * The details of the file to remove.
 */
export type DeleteFileType = {
  /**
   * The file's key. When uploading a file, the
   * returned key is used here.
   */
  fileKey: string
  [x: string]: unknown
}

/**
 * @interface
 * 
 * The details of the file being uploaded through a stream.
 */
export type UploadStreamDescriptorType = {
  /**
   * The name of the file.
   */
  name: string
  /**
   * The extension of the file.
   */
  ext?: string
  /**
   * Whether the file should be uploaded to a private bucket or location. By convention, the default value of this property is `true`.
   */
  isPrivate?: boolean
  [x: string]: unknown
}
