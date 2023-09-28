"use client"

import {
  AnalyticsProvider,
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
  NavbarProvider,
  PageLoadingProvider,
  ScrollControllerProvider,
} from "docs-ui"
import BaseSpecsProvider from "./base-specs"
import SidebarProvider from "./sidebar"
import SearchProvider from "./search"

type ProvidersProps = {
  children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <PageLoadingProvider>
        <ModalProvider>
          <ColorModeProvider>
            <BaseSpecsProvider>
              <SidebarProvider>
                <NavbarProvider>
                  <ScrollControllerProvider scrollableSelector="#main">
                    <SearchProvider>
                      <MobileProvider>{children}</MobileProvider>
                    </SearchProvider>
                  </ScrollControllerProvider>
                </NavbarProvider>
              </SidebarProvider>
            </BaseSpecsProvider>
          </ColorModeProvider>
        </ModalProvider>
      </PageLoadingProvider>
    </AnalyticsProvider>
  )
}

export default Providers
