/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

/**
 * The user's details.
 */
export interface AdminAuthRes {
  /**
   * User details.
   */
  user: User
}
