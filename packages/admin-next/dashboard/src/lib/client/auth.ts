import { EmailPassReq } from "../../types/api-payloads"
import { EmailPassRes } from "../../types/api-responses"
import { deleteRequest, postRequest } from "./common"

async function emailPass(payload: EmailPassReq) {
  return postRequest<EmailPassRes>("/auth/admin/emailpass", payload)
}

async function login(token: string) {
  return postRequest<void>("/auth/session", undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

async function logout() {
  return deleteRequest<void>("/auth/session")
}

export const auth = {
  authenticate: {
    emailPass,
  },
  login,
  logout,
}
