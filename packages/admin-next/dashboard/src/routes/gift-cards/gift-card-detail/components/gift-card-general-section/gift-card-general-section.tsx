import { ArrowUpRightOnBox, PencilSquare, Trash } from "@medusajs/icons"
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
import { Link, useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { currencies } from "../../../../../lib/currencies"
import { getPresentationalAmount } from "../../../../../lib/money-amount-helpers"

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
      description: t("giftCards.deleteGiftCardWarning", {
        code: giftCard.code,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
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

  let color: "green" | "red"

  if (
    giftCard.is_disabled ||
    (giftCard.ends_at && new Date(giftCard.ends_at) < new Date())
  ) {
    color = "red"
  } else {
    color = "green"
  }

  let text: string = t("general.enabled")

  if (giftCard.is_disabled) {
    text = t("general.disabled")
  }

  if (giftCard.ends_at && new Date(giftCard.ends_at) < new Date()) {
    text = t("general.expired")
  }

  const recipient = giftCard.metadata?.email as string | undefined

  const currencyCode = giftCard.region.currency_code.toUpperCase()
  const nativeSymbol = currencies[currencyCode].symbol_native

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <Heading>{giftCard.code}</Heading>
          <Copy content={giftCard.code} className="text-ui-fg-muted" />
        </div>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={color}>{text}</StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    to: "edit",
                  },
                ],
              },
              {
                actions: [
                  {
                    label: t("actions.delete"),
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
          {t("giftCards.currentBalance")}
        </Text>
        <Text size="small" leading="compact">
          {`${nativeSymbol} ${getPresentationalAmount(
            giftCard.balance,
            currencyCode
          )} ${currencyCode}`}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("giftCards.initialBalance")}
        </Text>
        <Text size="small" leading="compact">
          {`${nativeSymbol} ${getPresentationalAmount(
            giftCard.value,
            currencyCode
          )} ${currencyCode}`}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("giftCards.recipient")}
        </Text>
        <Text size="small" leading="compact">
          {recipient ?? "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.region")}
        </Text>
        <Link
          to={`/settings/regions/${giftCard.region.id}`}
          className="txt-compact-small text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg focus:shadow-borders-focus flex w-fit items-center gap-x-1.5 rounded-[4px] outline-none"
        >
          <span>{giftCard.region.name}</span>
          <ArrowUpRightOnBox />
        </Link>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.order")}
        </Text>

        {giftCard.order ? (
          <Link
            to={`/orders/${giftCard.order.id}`}
            className="txt-compact-small text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg focus:shadow-borders-focus flex w-fit items-center gap-x-1.5 rounded-[4px] outline-none"
          >
            <span>{`#${giftCard.order.display_id}`}</span>
            <ArrowUpRightOnBox />
          </Link>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
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
            : "-"}
        </Text>
      </div>
    </Container>
  )
}
