/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { User } from "./User"

export interface AdminAuthRes {
  /**
   * User details.
   */
  user: User
}
