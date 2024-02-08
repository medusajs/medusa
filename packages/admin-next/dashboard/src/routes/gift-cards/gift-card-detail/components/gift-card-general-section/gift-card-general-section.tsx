import { PencilSquare, Trash } from "@medusajs/icons"
import { GiftCard } from "@medusajs/medusa"
import {
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import format from "date-fns/format"
import { useAdminDeleteGiftCard } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type GiftCardGeneralSectionProps = {
  giftCard: GiftCard
}

export const GiftCardGeneralSection = ({
  giftCard,
}: GiftCardGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useAdminDeleteGiftCard(giftCard.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("giftCards.deleteGiftCardWarning"),
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..")
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <Heading>{giftCard.code}</Heading>
          <Copy content={giftCard.code} className="text-ui-fg-muted" />
        </div>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={giftCard.is_disabled ? "red" : "green"}>
            {giftCard.is_disabled
              ? t("general.disabled")
              : t("general.enabled")}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("general.edit"),
                    to: "edit",
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("general.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.region")}
        </Text>
        <Text size="small" leading="compact">
          {giftCard.region.name}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.order")}
        </Text>
        <Text size="small" leading="compact">
          {giftCard.order?.display_id ? `#${giftCard.order.display_id}` : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.issuedDate")}
        </Text>
        <Text size="small" leading="compact">
          {format(new Date(giftCard.created_at), "dd MMM yyyy")}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.expiryDate")}
        </Text>
        <Text size="small" leading="compact">
          {giftCard.ends_at
            ? format(new Date(giftCard.ends_at), "dd MMM yyyy")
            : "Doesn't expire"}
        </Text>
      </div>
    </Container>
  )
}
