"use client"

import {
  AiAssistantIcon,
  AiAssistantProvider,
  SearchProvider as UiSearchProvider,
  searchFiltersV2,
} from "docs-ui"
import { config } from "../config"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  return (
    <UiSearchProvider
      algolia={{
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp",
        mainIndexName:
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        indices: [
          process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        ],
      }}
      searchProps={{
        isLoading: false,
        suggestions: [
          {
            title: "Search Suggestions",
            items: [
              "Medusa Configurations",
              "Commerce Modules",
              "Medusa Workflows Reference",
              "Storefront Development",
            ],
          },
        ],
        checkInternalPattern: new RegExp(`^${config.baseUrl}/v2/resources/.*`),
        filterOptions: searchFiltersV2,
      }}
      commands={[
        {
          name: "ai-assistant",
          icon: <AiAssistantIcon />,
          component: (
            <AiAssistantProvider
              apiUrl={process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || "temp"}
              websiteId={process.env.NEXT_PUBLIC_AI_WEBSITE_ID || "temp"}
              recaptchaSiteKey={
                process.env.NEXT_PUBLIC_AI_API_ASSISTANT_RECAPTCHA_SITE_KEY ||
                "temp"
              }
            />
          ),
          title: "AI Assistant",
          badge: {
            variant: "blue",
            badgeType: "shaded",
            children: "Beta",
          },
        },
      ]}
      initialDefaultFilters={["resources"]}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
