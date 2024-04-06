import { UseMutationOptions, useMutation } from "@tanstack/react-query"

import { client } from "../../lib/client"
import { EmailPassReq } from "../../types/api-payloads"
import { EmailPassRes } from "../../types/api-responses"

export const useEmailPassLogin = (
  options?: UseMutationOptions<EmailPassRes, Error, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.auth.authenticate.emailPass(payload),
    onSuccess: async (data: { token: string }, variables, context) => {
      const { token } = data

      // Create a new session with the token
      await client.auth.login(token)

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
