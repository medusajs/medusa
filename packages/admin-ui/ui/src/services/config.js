const medusaUrl =
  document?.body?.dataset?.medusaApiUrl ||
  __MEDUSA_BACKEND_URL__ ||
  "http://localhost:9000"

export { medusaUrl }
