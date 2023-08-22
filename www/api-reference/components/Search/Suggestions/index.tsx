import clsx from "clsx"
import Badge from "../../Badge"
import { useInstantSearch } from "react-instantsearch"

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
      <span className="text-medium-plus mb-1 block">Search suggestions</span>
      <div className={clsx("flex flex-wrap gap-1")}>
        {suggestions.map((suggestion, index) => (
          <button
            onClick={() =>
              setIndexUiState({
                query: suggestion,
              })
            }
            className="btn-clear"
            key={index}
          >
            <Badge variant="neutral" className="text-small-plus cursor-pointer">
              {suggestion}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchSuggestions
