import { EmailPassReq } from "../../types/api-payloads"
import { EmailPassRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function emailPass(payload: EmailPassReq) {
  return makeRequest<EmailPassRes>("/auth/admin/emailpass", undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

async function login(token: string) {
  return makeRequest<void>("/auth/session", undefined, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const auth = {
  authenticate: {
    emailPass,
  },
  login,
}
