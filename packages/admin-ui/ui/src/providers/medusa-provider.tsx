import { QueryClient } from "@tanstack/react-query"
import { MedusaProvider as Provider } from "medusa-react"
import { PropsWithChildren } from "react"

const queryClient = new QueryClient({
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
      baseUrl={"http://localhost:9000"}
    >
      {children}
    </Provider>
  )
}
