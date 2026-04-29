"use client"

import {
  AiAssistantProvider,
  AiAssistantProviderProps,
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
  aiAssistantProps?: Partial<Omit<AiAssistantProviderProps, "children">>
}

const Providers = ({ children, aiAssistantProps = {} }: ProvidersProps) => {
  return (
    <AnalyticsProvider reoDevKey={process.env.NEXT_PUBLIC_REO_DEV_CLIENT_ID}>
      <SiteConfigProvider config={config}>
        <LearningPathProvider>
          <NotificationProvider>
            <ScrollControllerProvider scrollableSelector="#main">
              <SidebarProvider>
                <PaginationProvider>
                  <MainNavProvider>
                    <SearchProvider>
                      <AiAssistantProvider
                        {...aiAssistantProps}
                        integrationId={
                          process.env.NEXT_PUBLIC_INTEGRATION_ID || "temp"
                        }
                      >
                        <HooksLoader
                          options={{
                            pageScrollManager: true,
                            currentLearningPath: false,
                          }}
                        >
                          {children}
                        </HooksLoader>
                      </AiAssistantProvider>
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
