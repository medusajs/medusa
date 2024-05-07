/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Details on whether the email exists.
 */
export interface StoreGetAuthEmailRes {
  /**
   * Whether email exists or not.
   */
  exists: boolean
}
