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
    <div className="txt-compact-small flex size-full cursor-not-allowed items-center justify-between overflow-hidden bg-ui-bg-base px-4 py-2.5 text-ui-fg-subtle outline-none">
      {typeof children === "function"
        ? children({ value: watchedValue })
        : children}
    </div>
  )
}
