/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { BatchJob } from "./BatchJob"

/**
 * The batch job's details.
 */
export interface AdminBatchJobRes {
  /**
   * Batch job details.
   */
  batch_job: BatchJob
}
