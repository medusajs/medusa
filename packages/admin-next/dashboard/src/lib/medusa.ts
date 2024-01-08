import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

export const MEDUSA_BACKEND_URL =
  import.meta.env.VITE_MEDUSA_ADMIN_BACKEND_URL || "http://localhost:9000"

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
