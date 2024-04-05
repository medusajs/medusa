import { UpdateUserReq } from "../../types/api-payloads"
import { UserListRes, UserRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function me() {
  return makeRequest<UserRes>("/admin/users/me")
}

async function retrieveUser(id: string, query?: Record<string, any>) {
  return makeRequest<UserRes, Record<string, any>>(`/admin/users/${id}`, query)
}

async function listUsers(query?: Record<string, any>) {
  return makeRequest<UserListRes>(`/admin/users`, undefined, query)
}

async function updateUser(id: string, payload: UpdateUserReq) {
  return makeRequest<UserRes>(`/admin/users/${id}`, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const users = {
  me,
  retrieve: retrieveUser,
  list: listUsers,
  update: updateUser,
}
