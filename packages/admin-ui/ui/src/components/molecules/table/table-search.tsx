import clsx from "clsx"
import React from "react"
import SearchIcon from "../../fundamentals/icons/search-icon"

type TableSearchProps = {
  autoFocus?: boolean
  onSearch: (term: string) => void
  placeholder?: string
  searchValue?: string
} & React.HTMLAttributes<HTMLDivElement>

const TableSearch: React.FC<TableSearchProps> = ({
  autoFocus,
  onSearch,
  placeholder = "Search",
  searchValue,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "inter-small-regular mt-1 transition-color flex text-grey-50 items-center mb-1 pl-1 py-1.5 rounded-rounded border border-grey-20 min-w-content w-60 focus-within:shadow-input focus-within:border-violet-60 bg-grey-5",
        className
      )}
      {...props}
    >
      <span className="px-2.5 py-0.5">
        <SearchIcon size={16} />
      </span>
      <input
        autoFocus={autoFocus}
        type="text"
        value={searchValue}
        className={clsx(
          "focus:outline-none focus:border-none inter-small-regular w-full bg-transparent focus:text-grey-90 caret-violet-60 placeholder:inter-small-regular placeholder-grey-40"
        )}
        placeholder={placeholder}
        onChange={(e) => {
          onSearch(e.target.value)
        }}
      />
    </div>
  )
}

export default TableSearch
