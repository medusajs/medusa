/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Refund } from "./Refund"

/**
 * The refund's details.
 */
export interface AdminRefundRes {
  /**
   * Refund details.
   */
  refund: Refund
}
