/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * A Batch Job.
 */
export interface BatchJob {
  /**
   * The unique identifier for the batch job.
   */
  id: string
  /**
   * The type of batch job.
   */
  type: "product-import" | "product-export"
  /**
   * The status of the batch job.
   */
  status:
    | "created"
    | "pre_processed"
    | "confirmed"
    | "processing"
    | "completed"
    | "canceled"
    | "failed"
  /**
   * The unique identifier of the user that created the batch job.
   */
  created_by: string | null
  /**
   * A user object. Available if the relation `created_by_user` is expanded.
   */
  created_by_user?: User | null
  /**
   * The context of the batch job, the type of the batch job determines what the context should contain.
   */
  context: Record<string, any> | null
  /**
   * Specify if the job must apply the modifications or not.
   */
  dry_run: boolean
  /**
   * The result of the batch job.
   */
  result:
    | (Record<string, any> & {
        count?: number
        advancement_count?: number
        progress?: number
        errors?: {
          message?: string
          code?: string | number
          err?: any[]
        }
        stat_descriptors?: {
          key?: string
          name?: string
          message?: string
        }
        file_key?: string
        file_size?: number
      })
    | null
  /**
   * The date from which the job has been pre-processed.
   */
  pre_processed_at: string | null
  /**
   * The date the job is processing at.
   */
  processing_at: string | null
  /**
   * The date when the confirmation has been done.
   */
  confirmed_at: string | null
  /**
   * The date of the completion.
   */
  completed_at: string | null
  /**
   * The date of the concellation.
   */
  canceled_at: string | null
  /**
   * The date when the job failed.
   */
  failed_at: string | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was last updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
}
