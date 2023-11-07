/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductCollection } from "./ProductCollection"

/**
 * The details of the product collection.
 */
export interface StoreCollectionsRes {
  /**
   * Product collection details.
   */
  collection: ProductCollection
}
