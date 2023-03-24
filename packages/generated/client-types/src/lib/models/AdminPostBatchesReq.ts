/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostBatchesReq {
  /**
   * The type of batch job to start.
   */
  type: string
  /**
   * Additional infomration regarding the batch to be used for processing.
   */
  context: Record<string, any>
  /**
   * Set a batch job in dry_run mode to get some information on what will be done without applying any modifications.
   */
  dry_run?: boolean
}
