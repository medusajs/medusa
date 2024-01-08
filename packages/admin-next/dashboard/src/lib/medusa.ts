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

export const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
})
