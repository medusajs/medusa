import clsx from "clsx"
import IconMinusMini from "../../Icons/MinusMini"
import IconPlusMini from "../../Icons/PlusMini"

type DetailsSummaryProps = {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  expandable?: boolean
  open?: boolean
  className?: string
  titleClassName?: string
}

const DetailsSummary = ({
  title,
  subtitle,
  badge,
  expandable = true,
  open = false,
  className,
  titleClassName,
}: DetailsSummaryProps) => {
  return (
    <summary
      className={clsx(
        "border-medusa-border-base dark:border-medusa-border-base-dark border-y",
        "flex items-center justify-between py-[12px]",
        expandable && "cursor-pointer",
        "no-marker",
        className
      )}
    >
      <span className="flex flex-col gap-[4px]">
        <span
          className={clsx(
            "text-compact-medium-plus text-medusa-fg-base dark:text-medusa-fg-base-dark",
            titleClassName
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className="text-compact-medium text-medusa-fg-subtle dark:text-medusa-bg-subtle-dark">
            {subtitle}
          </span>
        )}
      </span>
      {(badge || expandable) && (
        <span className="flex gap-0.5">
          {badge}
          {expandable && <>{open ? <IconMinusMini /> : <IconPlusMini />}</>}
        </span>
      )}
    </summary>
  )
}

export default DetailsSummary
