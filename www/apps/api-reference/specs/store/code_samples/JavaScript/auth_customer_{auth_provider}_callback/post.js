import Medusa from "@medusajs/js-sdk"
import { decodeToken } from "react-jwt"

let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const token = await sdk.auth.callback(
  "customer",
  "google",
  {
    code: "123",
    state: "456"
  }
)
// all subsequent requests will use the token in the header

const decodedToken = decodeToken(token) as { actor_id: string, user_metadata: Record<string, unknown> }

const shouldCreateCustomer = decodedToken.actor_id === ""

if (shouldCreateCustomer) {
  const { customer } = await sdk.store.customer.create({
    email: decodedToken.user_metadata.email as string,
  })

  // refresh auth token
  await sdk.auth.refresh()
  // all subsequent requests will use the new token in the header
} else {
  // Customer already exists and is authenticated
}