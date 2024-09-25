import { Toaster, TooltipProvider } from "@medusajs/ui"
import { QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"

import { I18n } from "../components/utilities/i18n"
import { queryClient } from "../lib/query-client"
import { MedusaApp } from "../medusa-app"
import { I18nProvider } from "./i18n-provider"
import { MedusaAppProvider } from "./medusa-app-provider"
import { ThemeProvider } from "./theme-provider"

type ProvidersProps = PropsWithChildren<{
  getMenu: MedusaApp["getMenu"]
  getWidgets: MedusaApp["getWidgets"]
}>

export const Providers = ({
  getMenu,
  getWidgets,
  children,
}: ProvidersProps) => {
  return (
    <TooltipProvider>
      <MedusaAppProvider getMenu={getMenu} getWidgets={getWidgets}>
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
