import { Toaster, TooltipProvider } from "@medusajs/ui"
import { QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"

import { I18n } from "../components/utilities/i18n"
import { MedusaApp } from "../core/medusa-app/medusa-app"
import { queryClient } from "../lib/query-client"
import { I18nProvider } from "./i18n-provider"
import { MedusaAppProvider } from "./medusa-app-provider"
import { ThemeProvider } from "./theme-provider"

type ProvidersProps = PropsWithChildren<{
  api: MedusaApp["api"]
}>

export const Providers = ({ api, children }: ProvidersProps) => {
  return (
    <TooltipProvider>
      <MedusaAppProvider api={api}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <I18n />
              <I18nProvider>{children}</I18nProvider>
              <Toaster />
            </ThemeProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </MedusaAppProvider>
    </TooltipProvider>
  )
}
