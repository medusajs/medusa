import { DeleteResponse, PaginatedResponse } from "../../common";
import { AdminUser } from "../../user";
import { AdminInvite } from "./entities";

export interface AdminInviteResponse {
  invite: AdminInvite
}

export type AdminInviteListResponse = PaginatedResponse<{
  invites: AdminInvite[]
}>

export type AdminAcceptInviteResponse = {
  user: AdminUser
} | {
  message: string
}

export type AdminInviteDeleteResponse = DeleteResponse<"invite">