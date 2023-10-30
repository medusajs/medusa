"use client"

import {
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  NavbarProvider,
  AnalyticsProvider,
  ScrollControllerProvider,
  AiAssistantProvider,
} from "docs-ui"
import SearchProvider from "./search"
import SidebarProvider from "./sidebar"

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <MobileProvider>
        <ColorModeProvider>
          <ModalProvider>
            <SidebarProvider>
              <NavbarProvider basePath={process.env.NEXT_PUBLIC_BASE_PATH}>
                <SearchProvider>
                  <ScrollControllerProvider scrollableSelector="#main">
                    {children}
                  </ScrollControllerProvider>
                </SearchProvider>
              </NavbarProvider>
            </SidebarProvider>
          </ModalProvider>
        </ColorModeProvider>
      </MobileProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
