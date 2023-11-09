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
}
