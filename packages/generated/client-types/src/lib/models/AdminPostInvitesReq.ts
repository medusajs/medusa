/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInvitesReq {
  /**
   * The email associated with the invite. Once the invite is accepted, the email will be associated with the created user.
   */
  user: string
  /**
   * The role of the user to be created. This does not actually change the privileges of the user that is eventually created.
   */
  role: "admin" | "member" | "developer"
}
