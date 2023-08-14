/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

import type { Invite } from "./Invite"

export interface AdminListInvitesRes {
  /**
   * An array of invites
   */
  invites: Array<Invite>
}
