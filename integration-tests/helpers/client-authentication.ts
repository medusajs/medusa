const AUTH_COOKIE = {}
export async function getClientAuthenticationCookie(
  api,
  email = null,
  password = null
) {
  const user = {
    email: email ?? "test@medusajs.com",
    password: password ?? "test",
  }

  if (AUTH_COOKIE[user.email]) {
    return AUTH_COOKIE[user.email]
  }

  const authResponse = await api.post("/store/auth", user)
  AUTH_COOKIE[user.email] = authResponse.headers["set-cookie"][0].split(";")

  return AUTH_COOKIE[user.email]
}
