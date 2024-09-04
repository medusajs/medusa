import { PropsWithChildren } from "react"

import { useDataGridCellError } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridRowErrorIndicator } from "./data-grid-row-error-indicator"

type DataGridReadonlyCellProps<TData, TValue = any> = DataGridCellProps<
  TData,
  TValue
> &
  PropsWithChildren

export const DataGridReadonlyCell = <TData, TValue = any>({
  context,
  children,
}: DataGridReadonlyCellProps<TData, TValue>) => {
  const { rowErrors } = useDataGridCellError({ context })

  return (
    <div className="bg-ui-bg-subtle txt-compact-small text-ui-fg-subtle flex size-full cursor-not-allowed items-center justify-between overflow-hidden px-4 py-2.5 outline-none">
      <span className="truncate">{children}</span>
      <DataGridRowErrorIndicator rowErrors={rowErrors} />
    </div>
  )
}
