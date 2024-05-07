/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Store } from "./Store"

/**
 * The store's details.
 */
export interface AdminStoresRes {
  /**
   * Store details.
   */
  store: Store
}
