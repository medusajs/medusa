import clsx from "clsx"
import { AiAssistantChatWindow, MainNav, RootProviders } from "docs-ui"
import Providers from "../providers"
import HomepageTopSection from "../components/Homepage/TopSection"
import HomepageSectionsSeparator from "../components/Homepage/SectionsSeparator"
import HomepageBloom from "../components/Homepage/Bloom"
import HomepageLinksSection from "../components/Homepage/LinksSection"
import HomepageFrameworkSection from "../components/Homepage/FrameworkSection"
import HomepageCodeTabs from "../components/Homepage/CodeTabs"
import HomepageRecipesSection from "../components/Homepage/RecipesSection"
import HomepageCommerceModulesSection from "../components/Homepage/CommerceModulesSection"
import HomepageFooter from "../components/Homepage/Footer"

const Homepage = () => {
  return (
    <body
      className={clsx(
        "font-base text-medium w-full",
        "text-medusa-fg-base",
        "h-screen overflow-hidden"
      )}
    >
      <RootProviders
        layoutProviderProps={{
          disableResizeObserver: true,
        }}
      >
        <Providers
          aiAssistantProps={{
            chatType: "popover",
          }}
        >
          <div
            className={clsx(
              "bg-medusa-bg-base",
              "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
              "h-full w-full",
              "overflow-y-scroll overflow-x-hidden"
            )}
            id="main"
          >
            <MainNav className="border-b border-medusa-border-base bg-medusa-bg-component" />
            <div
              className={clsx(
                "xl:mx-auto xl:max-w-[1026px] w-full",
                "flex flex-col justify-center items-start",
                "xl:border-x xl:border-medusa-border-base"
              )}
            >
              <HomepageSectionsSeparator />
              <HomepageTopSection />
              <HomepageBloom />
              <HomepageSectionsSeparator />
              <HomepageLinksSection />
              <HomepageSectionsSeparator />
              <HomepageFrameworkSection />
              <HomepageCodeTabs />
              <HomepageSectionsSeparator />
              <HomepageRecipesSection />
              <HomepageSectionsSeparator />
              <HomepageCommerceModulesSection />
              <HomepageSectionsSeparator />
              <HomepageFooter />
            </div>
          </div>
          <AiAssistantChatWindow />
        </Providers>
      </RootProviders>
    </body>
  )
}

export default Homepage
