/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminUploadsRes {
  uploads: Array<{
    /**
     * The URL of the uploaded file.
     */
    url: string
  }>
}
