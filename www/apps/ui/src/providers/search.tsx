"use client"

import {
  AiAssistantCommandIcon,
  AiAssistantProvider,
  SearchProvider as UiSearchProvider,
} from "docs-ui"
import { absoluteUrl } from "../lib/absolute-url"
import clsx from "clsx"
import { Sparkles } from "@medusajs/icons"

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
      initialDefaultFilters={["ui"]}
      commands={[
        {
          name: "ai-assistant",
          icon: <AiAssistantCommandIcon />,
          component: (
            <AiAssistantProvider
              apiUrl={process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || "temp"}
              apiToken={
                process.env.NEXT_PUBLIC_AI_API_ASSISTANT_TOKEN || "temp"
              }
            />
          ),
          title: "AI Assistant",
        },
      ]}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
