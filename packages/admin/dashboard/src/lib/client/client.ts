import Medusa from "@medusajs/js-sdk"

export const backendUrl = __BACKEND_URL__ ?? "/"
const authType = __AUTH_TYPE__ ?? "session"
const jwtTokenStorageKey = __JWT_TOKEN_STORAGE_KEY__ || undefined

export const sdk = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: authType,
    jwtTokenStorageKey,
  },
})

// useful when you want to call the BE from the console and try things out quickly
if (typeof window !== "undefined") {
  ;(window as any).__sdk = sdk
}
