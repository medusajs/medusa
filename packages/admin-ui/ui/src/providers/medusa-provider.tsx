import { QueryClient } from "@tanstack/react-query"
import { MedusaProvider as Provider } from "medusa-react"
import { PropsWithChildren } from "react"
import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})

export const MedusaProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider
      queryClientProviderProps={{
        client: queryClient,
      }}
      baseUrl={MEDUSA_BACKEND_URL}
    >
      {children}
    </Provider>
  )
}
