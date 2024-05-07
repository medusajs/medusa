/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of deleting a payment collection.
 */
export interface AdminPaymentCollectionDeleteRes {
  /**
   * The ID of the deleted Payment Collection.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the Payment Collection was deleted.
   */
  deleted: boolean
}
