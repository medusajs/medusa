import { Toaster } from "@medusajs/ui"
import { QueryClientProvider } from "@tanstack/react-query"

import { I18n } from "./components/utilities/i18n"
import { queryClient } from "./lib/query-client"
import { RouterProvider } from "./providers/router-provider"
import { ThemeProvider } from "./providers/theme-provider"

import "./index.css"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18n />
        <RouterProvider />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
