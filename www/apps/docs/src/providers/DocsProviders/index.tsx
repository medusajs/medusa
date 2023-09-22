import { AnalyticsProvider, ModalProvider, NotificationProvider } from "docs-ui"
import React from "react"
import { useThemeConfig } from "@docusaurus/theme-common"
import { ThemeConfig } from "@medusajs/docs"
import SearchProvider from "../Search"
import LearningPathProvider from "../LearningPath"

type DocsProvidersProps = {
  children?: React.ReactNode
}

const DocsProviders = ({ children }: DocsProvidersProps) => {
  const {
    analytics: { apiKey },
  } = useThemeConfig() as ThemeConfig

  return (
    <AnalyticsProvider writeKey={apiKey}>
      <ModalProvider>
        <SearchProvider>
          <LearningPathProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </LearningPathProvider>
        </SearchProvider>
      </ModalProvider>
    </AnalyticsProvider>
  )
}

export default DocsProviders
