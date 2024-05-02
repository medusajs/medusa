/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostAuthReq {
  /**
   * The Customer's email.
   */
  email: string
  /**
   * The Customer's password.
   */
  password: string
}
