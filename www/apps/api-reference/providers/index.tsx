"use client"

import { AnalyticsProvider, ModalProvider, PageLoadingProvider } from "docs-ui"
import ColorModeProvider from "./color-mode"
import BaseSpecsProvider from "./base-specs"
import SidebarProvider from "./sidebar"
import NavbarProvider from "./navbar"
import { ScrollControllerProvider } from "../hooks/scroll-utils"
import SearchProvider from "./search"
import MobileProvider from "./mobile"

type ProvidersProps = {
  children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider key={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <PageLoadingProvider>
        <ModalProvider>
          <ColorModeProvider>
            <BaseSpecsProvider>
              <SidebarProvider>
                <NavbarProvider>
                  <ScrollControllerProvider>
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
