import { Text, Tooltip, clx } from "@medusajs/ui"
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
   * Is hte summary displayed inline.
   * Determines whether the center text is truncated if there is no space in the container
   */
  inline?: boolean
}

export const ListSummary = ({ list, inline, n = 2 }: ListSummaryProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={clx("text-ui-fg-subtle gap-x-2", {
        "inline-flex": inline,
        flex: !inline,
      })}
    >
      <Text as="span" leading="compact" size="small" className="truncate">
        {list.slice(0, n).join(", ")}
      </Text>
      {list.length > n && (
        <Tooltip
          content={
            <ul>
              {list.slice(n).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          }
        >
          <Text
            as="span"
            size="small"
            weight="plus"
            leading="compact"
            className="cursor-default whitespace-nowrap"
          >
            {t("general.plusCountMore", {
              count: list.length - n,
            })}
          </Text>
        </Tooltip>
      )}
    </div>
  )
}
