/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { BatchJob } from "./BatchJob"

export interface AdminBatchJobListRes {
  /**
   * An array of batch job details.
   */
  batch_jobs: Array<BatchJob>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of batch jobs skipped when retrieving the batch jobs.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
