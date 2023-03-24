/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostAuthReq {
  /**
   * The User's email.
   */
  email: string
  /**
   * The User's password.
   */
  password: string
}
