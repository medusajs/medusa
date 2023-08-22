import clsx from "clsx"
import Badge from "../../Badge"
import { useInstantSearch } from "react-instantsearch"
import Button from "../../Button"

const SearchSuggestions = () => {
  const { setIndexUiState } = useInstantSearch()
  const suggestions = [
    "Authentication",
    "Expanding fields",
    "Selecting fields",
    "Pagination",
    "Query parameter types",
  ]
  return (
    <div className="p-1">
      <span
        className={clsx(
          "text-medium-plus mb-1 block",
          "text-medusa-fg-base dark:text-medusa-fg-base-dark"
        )}
      >
        Search suggestions
      </span>
      <div className={clsx("flex flex-wrap gap-1")}>
        {suggestions.map((suggestion, index) => (
          <Button
            onClick={() =>
              setIndexUiState({
                query: suggestion,
              })
            }
            variant="clear"
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
  )
}

export default SearchSuggestions
