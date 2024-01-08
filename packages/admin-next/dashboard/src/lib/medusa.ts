import Medusa from "@medusajs/medusa-js"
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})

const BACKEND_URL =
  import.meta.env.VITE_MEDUSA_ADMIN_BACKEND_URL || "http://localhost:9000"

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
})
