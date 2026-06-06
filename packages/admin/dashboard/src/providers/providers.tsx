import { Toaster, TooltipProvider } from "@zjedene-medusa/ui"
import { QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"
import { I18n } from "../components/utilities/i18n"
import { DashboardApp } from "../dashboard-app"
import { queryClient } from "../lib/query-client"
import { ExtensionProvider } from "./extension-provider"
import { I18nProvider } from "./i18n-provider"
import { ThemeProvider } from "./theme-provider"
import { FeatureFlagProvider } from "./feature-flag-provider"
type ProvidersProps = PropsWithChildren<{
  api: DashboardApp["api"]
}>

export const Providers = ({ api, children }: ProvidersProps) => {
  return (
    <TooltipProvider>
      <ExtensionProvider api={api}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <FeatureFlagProvider>
                <I18n />
                <I18nProvider>{children}</I18nProvider>
                <Toaster />
              </FeatureFlagProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ExtensionProvider>
    </TooltipProvider>
  )
}
