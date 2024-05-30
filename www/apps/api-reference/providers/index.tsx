"use client"

import {
  AnalyticsProvider,
  ColorModeProvider,
  MobileProvider,
  ModalProvider,
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
              <ScrollControllerProvider scrollableSelector="#main">
                <SidebarProvider>
                  <SearchProvider>
                    <MobileProvider>{children}</MobileProvider>
                  </SearchProvider>
                </SidebarProvider>
              </ScrollControllerProvider>
            </BaseSpecsProvider>
          </ColorModeProvider>
        </ModalProvider>
      </PageLoadingProvider>
    </AnalyticsProvider>
  )
}

export default Providers
