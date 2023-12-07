/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The list of uploaded files.
 */
export interface AdminUploadsRes {
  /**
   * Uploaded files details.
   */
  uploads: Array<{
    /**
     * The URL of the uploaded file.
     */
    url: string
    /**
     * The key of the file that is identifiable by the file service. It can be used later to retrieve or manipulate the file.
     */
    key: string
  }>
}
