/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * The user's details.
 */
export interface AdminUserRes {
  /**
   * User details.
   */
  user: User
}
