"use client"

import {
  AiAssistantCommandIcon,
  AiAssistantProvider,
  SearchProvider as UiSearchProvider,
  searchFiltersV1,
} from "docs-ui"
import { absoluteUrl } from "../lib/absolute-url"

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
            items: ["Install in Admin Extension", "Icons", "Colors"],
          },
        ],
        checkInternalPattern: new RegExp(`^${absoluteUrl()}/ui`),
        filterOptions: searchFiltersV1,
      }}
      initialDefaultFilters={["ui"]}
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
