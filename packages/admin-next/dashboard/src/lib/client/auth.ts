import { EmailPassReq } from "../../types/api-payloads"
import { EmailPassRes } from "../../types/api-responses"
import { postRequest } from "./common"

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

export const auth = {
  authenticate: {
    emailPass,
  },
  login,
}
