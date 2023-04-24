import { FC, HTMLAttributes } from "react"
import clsx from "clsx"
import CheckCircleIcon from "../../../../components/fundamentals/icons/check-circle-icon"
import RefreshIcon from "../../../../components/fundamentals/icons/refresh-icon"

export interface AutoSavingIndicatorProps
  extends HTMLAttributes<HTMLDivElement> {
  isAutoSaving: boolean
  showLabel?: boolean
}

export const AutoSavingIndicator: FC<AutoSavingIndicatorProps> = ({
  isAutoSaving,
  className,
  showLabel = true,
}) => (
  <div
    className={clsx(
      "flex gap-1 items-center px-1 text-grey-40 inter-base-regular",
      className
    )}
  >
    {isAutoSaving && (
      <>
        <RefreshIcon size={20} className="animate-spin" />
        {showLabel && <span className="hidden small:inline">Saving...</span>}
      </>
    )}

    {!isAutoSaving && (
      <>
        <CheckCircleIcon size={20} />
        {showLabel && (
          <span className="hidden small:inline">Auto-save enabled</span>
        )}
      </>
    )}
  </div>
)
