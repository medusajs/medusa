import { AnalyticsProvider } from "docs-ui"
import React from "react"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"

type DocsProvidersProps = {
  children?: React.ReactNode
}

const DocsProviders = ({ children }: DocsProvidersProps) => {
  const {
    analytics: { apiKey },
  } = useThemeConfig() as ThemeConfig
  return <AnalyticsProvider writeKey={apiKey}>{children}</AnalyticsProvider>
}

export default DocsProviders
