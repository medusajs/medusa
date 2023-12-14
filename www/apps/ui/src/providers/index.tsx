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
            <ScrollControllerProvider scrollableSelector="#main">
              <SidebarProvider>
                <NavbarProvider basePath={process.env.NEXT_PUBLIC_BASE_PATH}>
                  <SearchProvider>{children}</SearchProvider>
                </NavbarProvider>
              </SidebarProvider>
            </ScrollControllerProvider>
          </ModalProvider>
        </ColorModeProvider>
      </MobileProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
