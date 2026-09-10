import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeletePriceListAction } from "../../../common/hooks/use-delete-price-list-action"
import { getPriceListStatus } from "../../../common/utils"
import { usePriceListPrices } from "../../../../../hooks/api"
import {
  usePriceListPermissions,
  usePricePermissions,
} from "../../../../../hooks/use-resource-permissions"

type PriceListGeneralSectionProps = {
  priceList: HttpTypes.AdminPriceList
}

export const PriceListGeneralSection = ({
  priceList,
}: PriceListGeneralSectionProps) => {
  const { t } = useTranslation()
  const { canUpdate, canDelete } = usePriceListPermissions()
  const { canRead: canReadPrices } = usePricePermissions()
  const {
    count: overrideCount,
    isLoading,
    error,
  } = usePriceListPrices(
    priceList.id,
    {
      limit: 1,
    },
    { enabled: canReadPrices }
  )

  const { color, text } = getPriceListStatus(t, priceList)

  const handleDelete = useDeletePriceListAction({ priceList })

  const type =
    priceList.type === "sale"
      ? t("priceLists.fields.type.options.sale.label")
      : t("priceLists.fields.type.options.override.label")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{priceList.title}</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge color={color}>{text}</StatusBadge>
          {(() => {
            const groups: ActionGroup[] = []

            if (canUpdate) {
              groups.push({
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              })
            }

            if (canDelete) {
              groups.push({
                actions: [
                  {
                    label: t("actions.delete"),
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              })
            }

            return groups.length > 0 ? <ActionMenu groups={groups} /> : null
          })()}
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("fields.type")}
        </Text>
        <Text size="small" className="text-pretty">
          {type}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" className="text-pretty">
          {priceList.description}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("priceLists.fields.priceOverrides.label")}
        </Text>
        {canReadPrices && !isLoading && !error && (
          <Text size="small" className="text-pretty">
            {overrideCount || "-"}
          </Text>
        )}
      </div>
    </Container>
  )
}
