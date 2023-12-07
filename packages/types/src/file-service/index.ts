import stream from "stream"

export type FileServiceUploadResult = {
  url: string
  key: string
}

export type FileServiceGetUploadStreamResult = {
  writeStream: stream.PassThrough
  promise: Promise<any>
  url: string
  fileKey: string
  [x: string]: unknown
}

export type GetUploadedFileType = {
  fileKey: string
  isPrivate?: boolean
  [x: string]: unknown
}

export type DeleteFileType = {
  fileKey: string
  [x: string]: unknown
}

export type UploadStreamDescriptorType = {
  name: string
  ext?: string
  isPrivate?: boolean
  [x: string]: unknown
}
