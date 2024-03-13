import { Trash } from "@medusajs/icons"
import { DraftOrder } from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { format } from "date-fns"
import { useAdminDeleteDraftOrder } from "medusa-react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"

type DraftOrderGeneralSectionProps = {
  draftOrder: DraftOrder
}

export const DraftOrderGeneralSection = ({
  draftOrder,
}: DraftOrderGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { color, label } = {
    open: {
      color: "orange",
      label: t("draftOrders.status.open"),
    },
    completed: {
      color: "green",
      label: t("draftOrders.status.completed"),
    },
  }[draftOrder.status] as { color: "green" | "orange"; label: string }

  const { mutateAsync } = useAdminDeleteDraftOrder(draftOrder.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("orders.cancelWarning", {
        id: `#${draftOrder.display_id}`,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
  }

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div>
        <div className="flex items-center gap-x-1">
          <Heading>#{draftOrder.display_id}</Heading>
          <Copy
            content={`#${draftOrder.display_id}`}
            className="text-ui-fg-muted"
          />
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          {format(new Date(draftOrder.created_at), "dd MMM, yyyy, HH:mm:ss")}
        </Text>
      </div>
      <div className="flex items-center gap-x-4">
        <StatusBadge color={color}>{label}</StatusBadge>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.delete"),
                  onClick: handleDelete,
                  icon: <Trash />,
                },
              ],
            },
          ]}
        />
      </div>
    </Container>
  )
}
