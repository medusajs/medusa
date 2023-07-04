/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostOrderEditsEditLineItemsReq {
  /**
   * The ID of the variant ID to add
   */
  variant_id: string
  /**
   * The quantity to add
   */
  quantity: number
  /**
   * An optional set of key-value pairs to hold additional information.
   */
  metadata?: Record<string, any>
}
