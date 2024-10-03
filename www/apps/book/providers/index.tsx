"use client"

import {
  AnalyticsProvider,
  HooksLoader,
  LearningPathProvider,
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
                          currentLearningPath: true,
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
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
