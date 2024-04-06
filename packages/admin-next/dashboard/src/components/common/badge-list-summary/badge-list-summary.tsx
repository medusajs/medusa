import { Badge, Tooltip, clx } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type BadgeListSummaryProps = {
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

  className?: string
}

export const BadgeListSummary = ({
  list,
  className,
  inline,
  n = 2,
}: BadgeListSummaryProps) => {
  const { t } = useTranslation()

  const title = t("general.plusCount", {
    count: list.length - n,
  })

  return (
    <div
      className={clx(
        "ml-2 text-ui-fg-subtle txt-compact-small gap-x-2 overflow-hidden",
        {
          "inline-flex": inline,
          flex: !inline,
        },
        className
      )}
    >
      {list.slice(0, n).map((item) => {
        return (
          <Badge key={item} size="2xsmall">
            {item}
          </Badge>
        )
      })}

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
            <Badge size="2xsmall" className="cursor-default whitespace-nowrap">
              {title}
            </Badge>
          </Tooltip>
        </div>
      )}
    </div>
  )
}
