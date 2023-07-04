/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminPostInvitesReq {
  /**
   * The email for the user to be created.
   */
  user: string
  /**
   * The role of the user to be created.
   */
  role: "admin" | "member" | "developer"
}
