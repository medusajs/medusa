/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminInviteDeleteRes {
  /**
   * The ID of the deleted Invite.
   */
  id: string
  /**
   * The type of the object that was deleted.
   */
  object: string
  /**
   * Whether or not the Invite was deleted.
   */
  deleted: boolean
}
