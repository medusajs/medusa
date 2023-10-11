import {
  AnalyticsProvider,
  ColorModeProvider,
  ModalProvider,
  NotificationProvider,
} from "docs-ui"
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
      <ColorModeProvider>
        <ModalProvider>
          <SearchProvider>
            <LearningPathProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </LearningPathProvider>
          </SearchProvider>
        </ModalProvider>
      </ColorModeProvider>
    </AnalyticsProvider>
  )
}

export default DocsProviders
