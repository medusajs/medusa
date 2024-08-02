import { PropsWithChildren } from "react"

type DataGridReadOnlyCellProps = PropsWithChildren

export const DataGridReadOnlyCell = ({
  children,
}: DataGridReadOnlyCellProps) => {
  return (
    <div className="bg-ui-bg-subtle txt-compact-small text-ui-fg-subtle flex size-full cursor-not-allowed items-center overflow-hidden px-4 py-2.5 outline-none">
      <span className="truncate">{children}</span>
    </div>
  )
}
