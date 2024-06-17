import { Tooltip, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type ListSummaryProps = {
  /**
   * Number of initial items to display
   * @default 2
   */
  n?: number
  /**
   * List of strings to display as abbreviated list
   */
  list: string[]
  /**
   * Is the summary displayed inline.
   * Determines whether the center text is truncated if there is no space in the container
   */
  inline?: boolean
  variant?: "base" | "compact"

  className?: string
}

export const ListSummary = ({
  list,
  className,
  variant = "compact",
  inline,
  n = 2,
}: ListSummaryProps) => {
  const { t } = useTranslation()

  const title = t("general.plusCountMore", {
    count: list.length - n,
  })

  return (
    <div
      className={clx(
        "text-ui-fg-subtle gap-x-1 overflow-hidden",
        {
          "inline-flex": inline,
          flex: !inline,
          "txt-compact-small": variant === "compact",
          "txt-small": variant === "base",
        },
        className
      )}
    >
      <div className="flex-1 truncate">
        <span className="truncate">{list.slice(0, n).join(", ")}</span>
      </div>
      {list.length > n && (
        <div className="whitespace-nowrap">
          <Tooltip
            content={
              <ul>
                {list.slice(n).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            }
          >
            <span className="cursor-default whitespace-nowrap">{title}</span>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
