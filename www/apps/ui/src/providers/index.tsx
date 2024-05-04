"use client"

import {
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  AnalyticsProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SearchProvider from "./search"
import SidebarProvider from "./sidebar"
import { siteConfig } from "../config/site"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={siteConfig}>
        <MobileProvider>
          <ColorModeProvider>
            <ModalProvider>
              <ScrollControllerProvider scrollableSelector="#main">
                <SidebarProvider>
                  <SearchProvider>{children}</SearchProvider>
                </SidebarProvider>
              </ScrollControllerProvider>
            </ModalProvider>
          </ColorModeProvider>
        </MobileProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
