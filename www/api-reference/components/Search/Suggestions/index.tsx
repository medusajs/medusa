import clsx from "clsx"
import { useInstantSearch } from "react-instantsearch"
import SearchHitGroupName from "../Hits/GroupName"

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
    <div className="h-full overflow-auto">
      <SearchHitGroupName name={"Search suggestions"} />
      {suggestions.map((suggestion, index) => (
        <div
          className={clsx(
            "flex items-center justify-between",
            "cursor-pointer rounded-sm p-0.5",
            "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark",
            "focus:bg-medusa-bg-base-hover dark:focus:bg-medusa-bg-base-hover-dark",
            "last:mb-1 focus:outline-none"
          )}
          onClick={() =>
            setIndexUiState({
              query: suggestion,
            })
          }
          key={index}
          tabIndex={index}
          data-hit
        >
          <span
            className={clsx(
              "text-medusa-fg-base dark:text-medusa-fg-base-dark",
              "text-compact-small"
            )}
          >
            {suggestion}
          </span>
        </div>
      ))}
    </div>
  )
}

export default SearchSuggestions
