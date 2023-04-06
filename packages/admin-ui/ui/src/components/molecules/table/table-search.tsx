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
        "inter-small-regular transition-color text-grey-50 rounded-rounded border-grey-20 min-w-content focus-within:shadow-input focus-within:border-violet-60 bg-grey-5 mt-1 mb-1 flex w-60 items-center border py-1.5 pl-1",
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
          "inter-small-regular focus:text-grey-90 caret-violet-60 placeholder:inter-small-regular placeholder-grey-40 w-full bg-transparent focus:border-none focus:outline-none"
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
