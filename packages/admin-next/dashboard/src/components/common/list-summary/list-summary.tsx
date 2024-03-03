import { Text, Tooltip } from "@medusajs/ui"
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
}

export const ListSummary = ({ list, n = 2 }: ListSummaryProps) => {
  const { t } = useTranslation()
  return (
    <div className="text-ui-fg-subtle inline-flex gap-x-2">
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
