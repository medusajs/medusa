"use client"

import {
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  AnalyticsProvider,
  ScrollControllerProvider,
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
                <SearchProvider>{children}</SearchProvider>
              </SidebarProvider>
            </ScrollControllerProvider>
          </ModalProvider>
        </ColorModeProvider>
      </MobileProvider>
    </AnalyticsProvider>
  )
}

export { Providers }
