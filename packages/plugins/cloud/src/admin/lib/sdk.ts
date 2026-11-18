import Medusa from "@medusajs/js-sdk"

const backendUrl = __BACKEND_URL__ ?? "/"
const authType = __AUTH_TYPE__ ?? "session"
const jwtTokenStorageKey = __JWT_TOKEN_STORAGE_KEY__ || undefined

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: authType,
    jwtTokenStorageKey: jwtTokenStorageKey,
  },
})
