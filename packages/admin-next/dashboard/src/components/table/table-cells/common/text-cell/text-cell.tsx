import { PlaceholderCell } from "../placeholder-cell"

type CellProps = {
  text?: string | number
}

type HeaderProps = {
  text: string
}

export const TextCell = ({ text }: CellProps) => {
  if (!text) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center gap-x-3 overflow-hidden">
      <span className="truncate">{text}</span>
    </div>
  )
}

export const TextHeader = ({ text }: HeaderProps) => {
  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{text}</span>
    </div>
  )
}
