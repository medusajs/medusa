import { DeleteResponse, PaginatedResponse } from "../../common"
import { AdminUser } from "./entities"

export interface AdminUserResponse {
  user: AdminUser
}

export interface AdminUserListResponse
  extends PaginatedResponse<{ users: AdminUser[] }> {}

export interface AdminUserDeleteResponse extends DeleteResponse<"user"> {}
