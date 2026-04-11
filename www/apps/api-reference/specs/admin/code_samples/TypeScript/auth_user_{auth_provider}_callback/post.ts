import Medusa from "@medusajs/js-sdk"
import { decodeToken } from "react-jwt"

export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: "session",
  },
})

const token = await sdk.auth.callback(
  "user",
  "github",
  {
    code: "123",
    state: "456"
  }
)
// all subsequent requests will use the token in the header

const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }

const shouldCreateUser = decodedToken.actor_id === ""

if (shouldCreateUser) {
  const user = await sdk.admin.invite.accept(
    {
      email: decodedToken.user_metadata.email as string,
      first_name: "John",
      last_name: "Smith",
      invite_token: "12345..."
    },
  )

  // refresh auth token
  await sdk.auth.refresh()
  // all subsequent requests will use the new token in the header
} else {
  // User already exists and is authenticated
}