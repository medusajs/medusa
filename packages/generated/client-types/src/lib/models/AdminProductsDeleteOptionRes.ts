/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Product } from "./Product"

export interface AdminProductsDeleteOptionRes {
  /**
   * The ID of the deleted Product Option
   */
  option_id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the items were deleted.
   */
  deleted: boolean
  product: Product
}
