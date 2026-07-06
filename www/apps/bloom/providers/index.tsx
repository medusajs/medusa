"use client"

import {
  AiAssistantProvider,
  AnalyticsProvider,
  ColorModeProvider,
  HooksLoader,
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
    <AnalyticsProvider reoDevKey={process.env.NEXT_PUBLIC_REO_DEV_CLIENT_ID}>
      <SiteConfigProvider config={config}>
        <MobileProvider>
          <ColorModeProvider>
            <ModalProvider>
              <NotificationProvider>
                <ScrollControllerProvider scrollableSelector="#main">
                  <SidebarProvider>
                    <PaginationProvider>
                      <MainNavProvider>
                        <SearchProvider>
                          <AiAssistantProvider
                            integrationId={
                              process.env.NEXT_PUBLIC_INTEGRATION_ID || "temp"
                            }
                            groupIds={[
                              process.env.NEXT_PUBLIC_KAPA_GROUP_ID || "temp",
                            ]}
                            suggestions={[
                              {
                                title: "FAQ",
                                items: [
                                  "What is Bloom?",
                                  "What are the main features of Bloom?",
                                  "What can I build with Bloom?",
                                  "How do I get started with Bloom?",
                                ],
                              },
                              {
                                title: "Prompting",
                                items: [
                                  "What are the best practices for prompting Bloom?",
                                  "What prompts can I use to design a store with Bloom?",
                                  "What prompts can I use to connect Bloom to third-party services?",
                                  "What ecommerce operations can I perform with Bloom prompts?",
                                ],
                              },
                            ]}
                            hideAiToolsMessage
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
            </ModalProvider>
          </ColorModeProvider>
        </MobileProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
