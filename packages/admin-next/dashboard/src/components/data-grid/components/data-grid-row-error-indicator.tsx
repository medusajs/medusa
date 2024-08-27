import { Badge, Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { DataGridRowError } from "../types"

type DataGridRowErrorIndicatorProps = {
  rowErrors: DataGridRowError[]
}

export const DataGridRowErrorIndicator = ({
  rowErrors,
}: DataGridRowErrorIndicatorProps) => {
  const rowErrorCount = rowErrors ? rowErrors.length : 0

  if (!rowErrors || rowErrorCount <= 0) {
    return null
  }

  return (
    <Tooltip
      content={
        <ul className="flex flex-col gap-y-3">
          {rowErrors.map((error, index) => (
            <DataGridRowErrorLine key={index} error={error} />
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

const DataGridRowErrorLine = ({
  error,
}: {
  error: { message: string; to: () => void }
}) => {
  const { t } = useTranslation()

  return (
    <li className="txt-compact-small flex flex-col items-start">
      {error.message}
      <button
        type="button"
        onClick={error.to}
        className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
      >
        {t("dataGrid.errors.fixError")}
      </button>
    </li>
  )
}
