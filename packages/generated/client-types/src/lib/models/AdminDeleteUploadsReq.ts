/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminDeleteUploadsReq {
  /**
   * key of the file to delete. This is obtained when you first uploaded the file, or by the file service if you used it directly.
   */
  file_key: string
}
