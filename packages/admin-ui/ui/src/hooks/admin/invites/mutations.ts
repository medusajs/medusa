import { AdminPostInvitesInviteAcceptReq } from "@medusajs/medusa/dist/api"
import { Invite } from "@medusajs/medusa/dist/models/invite"
import { useMutation } from "react-query"
import medusaRequest from "../../../services/request"

export interface AdminPostInvitesReq {
  initial_vendor_id?: string
  access_level?: AccessLevelEnum | string
  role: UserRole
  user: string
}

export type UserRole = "admin" | "member" | "developer"
export type AccessLevel = "view" | "update" | "owner"

export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

export declare enum AccessLevelEnum {
  VIEW = "view",
  UPDATE = "update",
  OWNER = "owner",
}

export const useAdminAcceptInvite = () => {
  const path = `/admin/invites/accept`

  return useMutation((payload: AdminPostInvitesInviteAcceptReq) =>
    medusaRequest<Invite>("POST", path, payload)
  )
}

export const useAdminCreateInvite = () => {
  const path = `/admin/invites`

  return useMutation((payload: AdminPostInvitesReq) =>
    medusaRequest<Invite>("POST", path, payload)
  )
}
