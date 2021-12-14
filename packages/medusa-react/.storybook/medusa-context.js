import React from "react"
import { QueryClient } from "react-query"
import { MedusaProvider } from "../src"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 1,
    },
  },
})

const DefaultMedusaProvider = (props) => (
  <MedusaProvider
    queryClientProviderProps={{ client: queryClient }}
    baseUrl={""}
    {...props}
  />
)

export default DefaultMedusaProvider
