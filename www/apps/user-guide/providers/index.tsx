"use client"

import {
  AnalyticsProvider,
  ColorModeProvider,
  HooksLoader,
  LearningPathProvider,
  MobileProvider,
  ModalProvider,
  NotificationProvider,
  PaginationProvider,
  ScrollControllerProvider,
  SiteConfigProvider,
} from "docs-ui"
import SidebarProvider from "./sidebar"
import SearchProvider from "./search"
import { config } from "../config"
import { MainNavProvider } from "./main-nav"

type ProvidersProps = {
  children?: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <AnalyticsProvider writeKey={process.env.NEXT_PUBLIC_SEGMENT_API_KEY}>
      <SiteConfigProvider config={config}>
        <MobileProvider>
          <ColorModeProvider>
            <ModalProvider>
              <LearningPathProvider>
                <NotificationProvider>
                  <ScrollControllerProvider scrollableSelector="#main">
                    <SidebarProvider>
                      <PaginationProvider>
                        <MainNavProvider>
                          <SearchProvider>
                            <HooksLoader
                              options={{
                                pageScrollManager: true,
                              }}
                            >
                              {children}
                            </HooksLoader>
                          </SearchProvider>
                        </MainNavProvider>
                      </PaginationProvider>
                    </SidebarProvider>
                  </ScrollControllerProvider>
                </NotificationProvider>
              </LearningPathProvider>
            </ModalProvider>
          </ColorModeProvider>
        </MobileProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
