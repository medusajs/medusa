import { FetchError } from "@medusajs/js-sdk"
import { QueryClient } from "@tanstack/react-query"

export const MEDUSA_BACKEND_URL = __BACKEND_URL__ ?? "/"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      // A 4xx (e.g. a 403 from a missing permission) won't succeed on retry.
      retry: (failureCount, error) => {
        const status = (error as FetchError)?.status
        if (status && status >= 400 && status < 500) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})
