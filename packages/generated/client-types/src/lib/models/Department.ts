/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Cart } from "./Cart"

/**
 * Represents a Department
 */
export interface Department {
  /**
   * The draft Department's ID
   */
  id: string
  /**
   * The draft store's display ID
   */
  store_id: string
  /**
   * The ID of the store associated with the Department order.
   */
  user_id: string | null
  /**
   * A User object Array..
   */
  users?: Cart | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at?: string
}
