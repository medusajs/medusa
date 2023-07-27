/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostBatchesReq {
  /**
   * The type of batch job to start, which is defined by the `batchType` property of the associated batch job strategy.
   */
  type: string
  /**
   * Additional infomration regarding the batch to be used for processing.
   */
  context: Record<string, any>
  /**
   * Set a batch job in dry_run mode, which would delay executing the batch job until it's confirmed.
   */
  dry_run?: boolean
}
