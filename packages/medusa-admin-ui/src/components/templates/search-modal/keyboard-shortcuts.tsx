import React from "react"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ArrowUpIcon from "../../fundamentals/icons/arrow-up-icon"
import DownLeftIcon from "../../fundamentals/icons/down-left"
import PointerIcon from "../../fundamentals/icons/pointer-icon"

const KeyboardShortcuts = ({ ...props }) => {
  return (
    <p {...props}>
      <span className="rounded p-1 bg-grey-10">
        <PointerIcon color="#9CA3AF" size="16px" />
      </span>
      or
      <span className="rounded p-1 bg-grey-10">
        <ArrowUpIcon color="#9CA3AF" size="16px" />
      </span>
      <span className="rounded -ml-1 p-1 bg-grey-10">
        <ArrowDownIcon color="#9CA3AF" size="16px" />
      </span>
      to navigate,
      <span className="rounded p-1 bg-grey-10">
        <DownLeftIcon color="#9CA3AF" size="16px" />
      </span>
      to select, and
      <span className="rounded px-1.5 py-0.5 bg-grey-10 font-semibold leading-small font-small">
        <OSCommandIcon />
      </span>
      <span className="-mx-2">+</span>
      <span className="rounded px-1.5 py-0.5 bg-grey-10 font-semibold leading-small font-small">
        K
      </span>
      to search anytime
    </p>
  )
}

const OSCommandIcon = () => {
  const isMac =
    typeof window !== "undefined" &&
    navigator?.platform?.toUpperCase().indexOf("MAC") >= 0
      ? true
      : false
  return <>{isMac ? "⌘" : "Ctrl"}</>
}

export default KeyboardShortcuts
