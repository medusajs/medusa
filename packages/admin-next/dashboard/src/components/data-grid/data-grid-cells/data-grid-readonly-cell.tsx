import { Badge, Tooltip } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { useDataGridErrors } from "../hooks"
import { DataGridCellProps } from "../types"

type DataGridReadonlyCellProps<TData, TValue = any> = DataGridCellProps<
  TData,
  TValue
> &
  PropsWithChildren

export const DataGridReadonlyCell = <TData, TValue = any>({
  context,
  children,
}: DataGridReadonlyCellProps<TData, TValue>) => {
  const { rowErrors } = useDataGridErrors({ context })

  return (
    <div className="bg-ui-bg-subtle txt-compact-small text-ui-fg-subtle flex size-full cursor-not-allowed items-center justify-between overflow-hidden px-4 py-2.5 outline-none">
      <span className="truncate">{children}</span>
      <RowErrorIndicator rowErrors={rowErrors} />
    </div>
  )
}

const RowErrorIndicator = ({
  rowErrors,
}: {
  rowErrors: { message: string; to: () => void }[]
}) => {
  const rowErrorCount = rowErrors ? rowErrors.length : 0

  if (!rowErrors || rowErrorCount <= 0) {
    return null
  }

  return (
    <Tooltip
      content={
        <ul className="flex flex-col gap-y-3">
          {rowErrors.map((error, index) => (
            <FieldErrorLine key={index} error={error} />
          ))}
        </ul>
      }
      delayDuration={0}
    >
      <Badge color="red" size="2xsmall" className="cursor-default">
        {rowErrorCount}
      </Badge>
    </Tooltip>
  )
}

const FieldErrorLine = ({
  error,
}: {
  error: { message: string; to: () => void }
}) => {
  // // check if the ref has a focus method
  // if (ref && typeof ref === "object" && "focus" in ref) {
  //   canFocusRef = true
  // }

  return (
    <li className="txt-compact-small flex flex-col items-start">
      {error.message}
      <button
        type="button"
        onClick={error.to}
        className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
      >
        Fix error
      </button>
    </li>
  )
}
