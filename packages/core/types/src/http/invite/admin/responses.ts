import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminUser } from "../../user"
import { AdminInvite } from "./entities"

export interface AdminInviteResponse {
  /**
   * The invite's details.
   */
  invite: AdminInvite
}

export type AdminInviteListResponse = PaginatedResponse<{
  /**
   * The list of invites.
   */
  invites: AdminInvite[]
}>

export type AdminAcceptInviteResponse =
  | {
    /**
     * The user's details.
     */
      user: AdminUser
    }
  | {
    /**
     * A message if an error occurs.
     */
      message: string
    }

export type AdminInviteDeleteResponse = DeleteResponse<"invite">
