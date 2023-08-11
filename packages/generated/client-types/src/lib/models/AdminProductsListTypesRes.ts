/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { ProductType } from "./ProductType"

export interface AdminProductsListTypesRes {
  /**
   * An array of product types details.
   */
  types: Array<ProductType>
}
