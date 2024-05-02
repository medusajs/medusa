/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StoreGetPaymentCollectionsParams {
  /**
   * Comma-separated fields that should be expanded in the returned payment collection.
   */
  fields?: string
  /**
   * Comma-separated relations that should be expanded in the returned payment collection.
   */
  expand?: string
}
