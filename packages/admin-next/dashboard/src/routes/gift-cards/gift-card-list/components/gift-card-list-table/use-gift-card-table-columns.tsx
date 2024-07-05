import { PencilSquare, Trash } from "@medusajs/icons"
import { GiftCard } from "@medusajs/medusa"
import { Badge, usePrompt } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAdminDeleteGiftCard } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell"
import { MoneyAmountCell } from "../../../../../components/table/table-cells/common/money-amount-cell"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { DisplayIdCell } from "../../../../../components/table/table-cells/order/display-id-cell"

const columnHelper = createColumnHelper<GiftCard>()

export const useGiftCardTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("code", {
        header: t("fields.code"),
        cell: ({ getValue }) => {
          return (
            <Badge size="2xsmall" className="overflow-hidden truncate">
              {getValue()}
            </Badge>
          )
        },
      }),
      columnHelper.accessor("order", {
        header: t("fields.order"),
        cell: ({ getValue }) => {
          const order = getValue()
          return <DisplayIdCell displayId={order?.display_id} />
        },
      }),
      columnHelper.accessor("region", {
        header: t("fields.region"),
        cell: ({ row }) => {
          return row.original.region.name
        },
      }),
      columnHelper.accessor("is_disabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const isDisabled = getValue()

          return (
            <StatusCell color={isDisabled ? "red" : "green"}>
              {isDisabled ? t("general.disabled") : t("general.enabled")}
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.dateIssued"),
        cell: ({ getValue }) => {
          return <DateCell date={getValue()} />
        },
      }),
      columnHelper.accessor("value", {
        header: t("giftCards.initialBalance"),
        cell: ({ getValue, row }) => {
          const currencyCode = row.original.region.currency_code
          const value = getValue()

          return <MoneyAmountCell amount={value} currencyCode={currencyCode} />
        },
      }),
      columnHelper.accessor("balance", {
        header: t("giftCards.currentBalance"),
        cell: ({ getValue, row }) => {
          const currencyCode = row.original.region.currency_code
          const value = getValue()

          return <MoneyAmountCell amount={value} currencyCode={currencyCode} />
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <GiftCardActions giftCard={row.original} />,
      }),
    ],
    [t]
  ) as ColumnDef<GiftCard>[]
}

const GiftCardActions = ({ giftCard }: { giftCard: GiftCard }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

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

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/gift-cards/${giftCard.id}/edit`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
