import React from "react"
import clsx from "clsx"
import { useInstantSearch } from "react-instantsearch"
import SearchHitGroupName from "../Hits/GroupName"

const SearchSuggestions = () => {
  const { setIndexUiState } = useInstantSearch()
  const suggestions = [
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
  ]
  return (
    <div className="h-full overflow-auto">
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <div
              className={clsx(
                "flex items-center justify-between",
                "cursor-pointer rounded-sm p-0.5",
                "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark",
                "focus:bg-medusa-bg-base-hover dark:focus:bg-medusa-bg-base-hover-dark",
                "focus:outline-none last:mb-1"
              )}
              onClick={() =>
                setIndexUiState({
                  query: item,
                })
              }
              key={itemIndex}
              tabIndex={itemIndex}
              data-hit
            >
              <span
                className={clsx(
                  "text-medusa-fg-base dark:text-medusa-fg-base-dark",
                  "text-compact-small"
                )}
              >
                {item}
              </span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}

export default SearchSuggestions
