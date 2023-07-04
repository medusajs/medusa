import {
  AdminCreateUserRequest,
  AdminPostInvitesReq,
  AdminUpdateUserRequest,
} from "@medusajs/medusa"

export interface HTTPResponse {
  status: number
  statusText: string
  headers: Record<string, string> & {
    "set-cookie"?: string[]
  }
  config: any
  request?: any
}

export type Response<T> = T & {
  response: HTTPResponse
}

export type ResponsePromise<T = any> = Promise<Response<T>>

type NoUndefined<T> = T extends undefined ? never : T

type CreateUserRolesEnum = NoUndefined<AdminCreateUserRequest["role"]>

// convert Enum type to union of string literals
export type CreateUserRoles = `${CreateUserRolesEnum}`

// remove enum type and replace with union type
export type AdminCreateUserPayload =
  | Omit<AdminCreateUserRequest, "role">
  | {
      role?: CreateUserRoles
    }

type UpdateUserRolesEnum = NoUndefined<AdminUpdateUserRequest["role"]>

export type UpdateUserRoles = `${UpdateUserRolesEnum}`

export type AdminUpdateUserPayload = Omit<AdminUpdateUserRequest, "role"> & {
  role?: UpdateUserRoles
}

export type InviteUserRolesEnum = `${AdminPostInvitesReq["role"]}`

export type AdminPostInvitesPayload = Omit<AdminPostInvitesReq, "role"> & {
  role: InviteUserRolesEnum
}

export type AdminCreateUploadPayload = File | File[]
