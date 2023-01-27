import { QueryClient } from "@tanstack/react-query"
import { MedusaProvider } from "medusa-react"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MedusaProvider
      baseUrl={__BACKEND__}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <App />
    </MedusaProvider>
  </React.StrictMode>
)
