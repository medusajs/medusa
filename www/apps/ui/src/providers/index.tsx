"use client"

import {
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  AnalyticsProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
  LayoutProvider,
} from "docs-ui"
import SearchProvider from "./search"
import SidebarProvider from "./sidebar"
import { siteConfig } from "../config/site"
import { MainNavProvider } from "./main-nav"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={siteConfig}>
        <LayoutProvider>
          <MobileProvider>
            <ColorModeProvider>
              <ModalProvider>
                <ScrollControllerProvider scrollableSelector="#main">
                  <SidebarProvider>
                    <MainNavProvider>
                      <SearchProvider>{children}</SearchProvider>
                    </MainNavProvider>
                  </SidebarProvider>
                </ScrollControllerProvider>
              </ModalProvider>
            </ColorModeProvider>
          </MobileProvider>
        </LayoutProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
