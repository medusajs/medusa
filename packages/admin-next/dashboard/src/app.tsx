import { Toaster } from "@medusajs/ui"
import { MedusaProvider } from "medusa-react"

import { RouterProvider } from "./providers/router-provider"
import { ThemeProvider } from "./providers/theme-provider"

import { MEDUSA_BACKEND_URL, queryClient } from "./lib/medusa"

function App() {
  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <ThemeProvider>
        <RouterProvider />
        <Toaster />
      </ThemeProvider>
    </MedusaProvider>
  )
}

export default App
