import { DocumentTextSolid } from "@medusajs/icons"
import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNotes } from "../../../../../hooks/api/notes"
import { PlaceholderCell } from "../../common/placeholder-cell"

type OrderNotesIndicatorCellProps = {
  /**
   * The id of the order this cell's row represents.
   */
  orderId: string
  /**
   * The ids of every order on the current page. Every cell in the column
   * receives the same list, so the resulting `useNotes` calls share the same
   * query key and react-query collapses them into a single `resource_id[]`
   * request for the whole page instead of one request per row.
   */
  orderIdsOnPage: string[]
}

export const OrderNotesIndicatorCell = ({
  orderId,
  orderIdsOnPage,
}: OrderNotesIndicatorCellProps) => {
  const { t } = useTranslation()

  const { notes } = useNotes(
    {
      resource_type: "order",
      resource_id: orderIdsOnPage,
    },
    {
      enabled: orderIdsOnPage.length > 0,
    }
  )

  const hasNotes = !!notes?.some((note) => note.resource_id === orderId)

  if (!hasNotes) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-5 items-center justify-center">
      <Tooltip content={t("notes.header")}>
        <DocumentTextSolid className="text-ui-fg-subtle" />
      </Tooltip>
    </div>
  )
}

export const OrderNotesIndicatorHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("notes.header")}</span>
    </div>
  )
}
