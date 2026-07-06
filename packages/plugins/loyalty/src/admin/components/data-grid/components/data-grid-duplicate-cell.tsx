import { ReactNode } from "react"
import { useDataGridDuplicateCell } from "../hooks"

interface DataGridDuplicateCellProps<TValue> {
  duplicateOf: string
  children?: ReactNode | ((props: { value: TValue }) => ReactNode)
}
export const DataGridDuplicateCell = <TValue,>({
  duplicateOf,
  children,
}: DataGridDuplicateCellProps<TValue>) => {
  const { watchedValue } = useDataGridDuplicateCell({ duplicateOf })

  return (
    <div className="bg-ui-bg-base txt-compact-small text-ui-fg-subtle flex size-full cursor-not-allowed items-center justify-between overflow-hidden px-4 py-2.5 outline-none">
      {typeof children === "function"
        ? children({ value: watchedValue })
        : children}
    </div>
  )
}
