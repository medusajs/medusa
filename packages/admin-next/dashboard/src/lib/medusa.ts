import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

export const MEDUSA_BACKEND_URL = __BACKEND_URL__ ?? "http://localhost:9000"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 1,
})
