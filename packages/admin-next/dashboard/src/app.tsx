import { Toaster } from "@medusajs/ui"
import { MedusaProvider } from "medusa-react"

import { AuthProvider } from "./providers/auth-provider"
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
        <AuthProvider>
          <RouterProvider />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </MedusaProvider>
  )
}

export default App
