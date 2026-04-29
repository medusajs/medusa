import {
  AiAssistantProvider,
  AnalyticsProvider,
  PageLoadingProvider,
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
        <PageLoadingProvider>
          <ScrollControllerProvider scrollableSelector="#main">
            <SidebarProvider>
              <MainNavProvider>
                <SearchProvider>
                  <AiAssistantProvider
                    integrationId={
                      process.env.NEXT_PUBLIC_INTEGRATION_ID || "temp"
                    }
                    chatType="popover"
                  >
                    {children}
                  </AiAssistantProvider>
                </SearchProvider>
              </MainNavProvider>
            </SidebarProvider>
          </ScrollControllerProvider>
        </PageLoadingProvider>
      </SiteConfigProvider>
    </AnalyticsProvider>
  )
}

export default Providers
