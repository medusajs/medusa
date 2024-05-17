import { useMutation } from "@tanstack/react-query"
import { medusa } from "../medusa"
import { AcceptInviteInput, CreateAuthUserInput } from "./types/auth"

export const useV2CreateAuthUser = (provider = "emailpass") => {
  // TODO: Migrate type to work for other providers, e.g. Google
  return useMutation((args: CreateAuthUserInput) =>
    medusa.client.request("POST", `/auth/admin/${provider}`, args)
  )
}

export const useV2AcceptInvite = (inviteToken: string) => {
  return useMutation((input: AcceptInviteInput) =>
    medusa.client.request(
      "POST",
      `/admin/invites/accept?token=${inviteToken}`,
      input.payload,
      {},
      {
        Authorization: `Bearer ${input.token}`,
      }
    )
  )
}
