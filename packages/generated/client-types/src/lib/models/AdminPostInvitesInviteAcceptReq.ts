/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * The details of the invite to be accepted.
 */
export interface AdminPostInvitesInviteAcceptReq {
  /**
   * The token of the invite to accept. This is a unique token generated when the invite was created or resent.
   */
  token: string
  /**
   * The details of the user to create.
   */
  user: {
    /**
     * the first name of the User
     */
    first_name: string
    /**
     * the last name of the User
     */
    last_name: string
    /**
     * The password for the User
     */
    password: string
  }
}
