"use client"

import {
  usePageLoading,
  SearchProvider as UiSearchProvider,
  AiAssistantCommandIcon,
  AiAssistantProvider,
} from "docs-ui"
import getBaseUrl from "../utils/get-base-url"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  const { isLoading } = usePageLoading()
  return (
    <UiSearchProvider
      algolia={{
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp",
        mainIndexName: process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
        indices: [
          process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
        ],
      }}
      searchProps={{
        isLoading,
        suggestions: [
          {
            title: "Search Suggestions",
            items: [
              "Authentication",
              "Expanding fields",
              "Selecting fields",
              "Pagination",
              "Query parameter types",
            ],
          },
        ],
        checkInternalPattern: new RegExp(`^${getBaseUrl()}/api/(admin|store)`),
        filterOptions: [
          {
            value: "admin",
            label: "Admin API",
          },
          {
            value: "store",
            label: "Store API",
          },
          {
            value: "docs",
            label: "Docs",
          },
          {
            value: "user-guide",
            label: "User Guide",
          },
          {
            value: "plugins",
            label: "Plugins",
          },
          {
            value: "reference",
            label: "References",
          },
          {
            value: "ui",
            label: "UI",
          },
        ],
      }}
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
