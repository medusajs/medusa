import React from "react"
import clsx from "clsx"
import Badge from "../../Badge"
import { useInstantSearch } from "react-instantsearch"
import Button from "../../Button"

const SearchSuggestions = () => {
  const { setIndexUiState } = useInstantSearch()
  const suggestions = {
    gettingStarted: [
      "Install Medusa with create-medusa-app",
      "Next.js quickstart",
      "Admin dashboard quickstart",
      "Commerce features",
      "Medusa architecture",
    ],
    development: [
      "Recipes",
      "How to create endpoints",
      "How to create an entity",
      "How to create a plugin",
      "How to create an admin widget",
    ],
  }
  return (
    <div className="p-1 flex flex-col gap-1">
      <div>
        <span
          className={clsx(
            "text-medium-plus mb-1 block",
            "text-medusa-fg-base dark:text-medusa-fg-base-dark"
          )}
        >
          Getting started? Try one of the following terms.
        </span>
        <div className={clsx("flex flex-wrap gap-0.5")}>
          {suggestions.gettingStarted.map((suggestion, index) => (
            <Button
              onClick={() =>
                setIndexUiState({
                  query: suggestion,
                })
              }
              variant="clear"
              className="p-0"
              key={index}
            >
              <Badge
                variant="neutral"
                className={clsx(
                  "text-small-plus cursor-pointer",
                  "hover:bg-medusa-tag-neutral-bg-hover dark:hover:bg-medusa-tag-neutral-bg-hover-dark"
                )}
              >
                {suggestion}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <span
          className={clsx(
            "text-medium-plus mb-1 block",
            "text-medusa-fg-base dark:text-medusa-fg-base-dark"
          )}
        >
          Developing with Medusa
        </span>
        <div className={clsx("flex flex-wrap gap-0.5")}>
          {suggestions.development.map((suggestion, index) => (
            <Button
              onClick={() =>
                setIndexUiState({
                  query: suggestion,
                })
              }
              variant="clear"
              className="p-0"
              key={index}
            >
              <Badge
                variant="neutral"
                className={clsx(
                  "text-small-plus cursor-pointer",
                  "hover:bg-medusa-tag-neutral-bg-hover dark:hover:bg-medusa-tag-neutral-bg-hover-dark"
                )}
              >
                {suggestion}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchSuggestions
