/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * The list of users.
 */
export interface AdminUsersListRes {
  /**
   * An array of users details.
   */
  users: Array<User>
  /**
   * The total number of items available
   */
  count: number
  /**
   * The number of users skipped when retrieving the users.
   */
  offset: number
  /**
   * The number of items per page
   */
  limit: number
}
