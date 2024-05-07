"use client"

import {
  SearchProvider as UiSearchProvider,
  AiAssistantCommandIcon,
  AiAssistantProvider,
  searchFiltersV1,
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
              "Create a product",
              "View list of orders",
              "Manage regions",
              "Add fulfillment provider to a region",
              "Add payment provider to a region",
              "Manage price lists",
              "Manage team",
            ],
          },
        ],
        checkInternalPattern: new RegExp(`^${config.baseUrl}/user-guide`),
        filterOptions: searchFiltersV1,
      }}
      initialDefaultFilters={["user-guide"]}
      commands={[
        {
          name: "ai-assistant",
          icon: <AiAssistantCommandIcon />,
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
            variant: "purple",
            children: "Beta",
          },
        },
      ]}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
