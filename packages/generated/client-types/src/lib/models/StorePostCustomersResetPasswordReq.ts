/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface StorePostCustomersResetPasswordReq {
  /**
   * The email of the customer.
   */
  email: string
  /**
   * The Customer's password.
   */
  password: string
  /**
   * The reset password token
   */
  token: string
}
