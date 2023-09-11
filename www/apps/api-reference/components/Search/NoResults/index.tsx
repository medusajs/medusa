import IconExclamationCircleSolid from "../../Icons/ExclamationCircleSolid"

const SearchNoResult = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      <IconExclamationCircleSolid iconColorClassName="fill-medusa-fg-muted dark:fill-medusa-fg-muted-dark" />
      <span className="text-compact-small text-medusa-fg-muted dark:text-medusa-fg-muted-dark">
        No results found. Try changing selected filters.
      </span>
    </div>
  )
}

export default SearchNoResult
