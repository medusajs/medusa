import { UpdateUserReq } from "../../types/api-payloads"
import { UserDeleteRes, UserListRes, UserRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function me() {
  return getRequest<UserRes>("/admin/users/me")
}

async function retrieveUser(id: string, query?: Record<string, any>) {
  return getRequest<UserRes>(`/admin/users/${id}`, query)
}

async function listUsers(query?: Record<string, any>) {
  return getRequest<UserListRes>(`/admin/users`, query)
}

async function updateUser(id: string, payload: UpdateUserReq) {
  return postRequest<UserRes>(`/admin/users/${id}`, payload)
}

async function deleteUser(id: string) {
  return deleteRequest<UserDeleteRes>(`/admin/users/${id}`)
}

export const users = {
  me,
  retrieve: retrieveUser,
  list: listUsers,
  update: updateUser,
  delete: deleteUser,
}
