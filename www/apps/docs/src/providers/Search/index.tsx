import React, { useEffect, useState } from "react"
import { SearchProvider as UiSearchProvider, checkArraySameElms } from "docs-ui"
import { ThemeConfig } from "@medusajs/docs"
import { useThemeConfig } from "@docusaurus/theme-common"
import { useLocalPathname } from "@docusaurus/theme-common/internal"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  const [defaultFilters, setDefaultFilters] = useState<string[]>([])
  const { algoliaConfig: algolia } = useThemeConfig() as ThemeConfig
  const currentPath = useLocalPathname()

  useEffect(() => {
    let resultFilters = []
    algolia.defaultFiltersByPath.some((filtersByPath) => {
      if (currentPath.startsWith(filtersByPath.path)) {
        resultFilters = filtersByPath.filters
      }
    })
    if (!resultFilters.length && algolia.defaultFilters) {
      resultFilters = algolia.defaultFilters
    }
    if (!checkArraySameElms(defaultFilters, resultFilters)) {
      setDefaultFilters(resultFilters)
    }
  }, [currentPath])

  return (
    <UiSearchProvider
      algolia={{
        appId: algolia.appId,
        apiKey: algolia.apiKey,
        mainIndexName: algolia.indexNames.docs,
        indices: Object.values(algolia.indexNames),
      }}
      searchProps={{
        filterOptions: algolia.filters,
        suggestions: [
          {
            title: "Getting started? Try one of the following terms.",
            items: [
              "Install Medusa with create-medusa-app",
              "Next.js quickstart",
              "Admin dashboard quickstart",
              "Commerce modules",
              "Medusa architecture",
            ],
          },
          {
            title: "Developing with Medusa",
            items: [
              "Recipes",
              "How to create endpoints",
              "How to create an entity",
              "How to create a plugin",
              "How to create an admin widget",
            ],
          },
        ],
        className: "z-[500]",
      }}
      initialDefaultFilters={defaultFilters}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
