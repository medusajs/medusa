import { DocumentText } from "@medusajs/icons"
import { IconButton, Popover } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ResourceNotesSection } from "../../../../../components/common/resource-notes-section"

type OrderLineItemNotesPopoverProps = {
  lineItemId: string
}

export const OrderLineItemNotesPopover = ({
  lineItemId,
}: OrderLineItemNotesPopoverProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <IconButton
          type="button"
          variant="transparent"
          size="small"
          className="text-ui-fg-muted hover:text-ui-fg-subtle active:text-ui-fg-subtle"
        >
          <span className="sr-only">{t("notes.header")}</span>
          <DocumentText />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content
        align="end"
        side="top"
        className="w-[320px] overflow-hidden p-0"
      >
        <ResourceNotesSection
          resourceType="order_line_item"
          resourceId={lineItemId}
        />
      </Popover.Content>
    </Popover>
  )
}
