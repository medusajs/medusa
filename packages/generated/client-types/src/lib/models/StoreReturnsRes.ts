/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Return } from "./Return"
import type { ReturnItem } from "./ReturnItem"

/**
 * The return's details.
 */
export interface StoreReturnsRes {
  /**
   * Return details.
   */
  return: Merge<
    SetRelation<Return, "items">,
    {
      items: Array<SetRelation<ReturnItem, "reason">>
    }
  >
}
