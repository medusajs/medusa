/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostUploadsDownloadUrlReq {
  /**
   * key of the file to obtain the download link for. This is obtained when you first uploaded the file, or by the file service if you used it directly.
   */
  file_key: string
}
