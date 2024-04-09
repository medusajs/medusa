import { PencilSquare, Trash } from "@medusajs/icons"
import { PriceListDTO } from "@medusajs/types"
import { Container, Heading, StatusBadge, Text, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeletePriceList } from "../../../../../hooks/api/price-lists"
import { getPriceListStatus } from "../../../common/utils"

type PricingGeneralSectionProps = {
  priceList: PriceListDTO
}

export const PricingGeneralSection = ({
  priceList,
}: PricingGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeletePriceList(priceList.id)

  const overrideCount = priceList.prices?.length || 0

  const { color, text } = getPriceListStatus(t, priceList)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("pricing.warnings.delete", {
        name: priceList.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..", { replace: true })
      },
    })
  }

  const type =
    priceList.type === "sale"
      ? t("pricing.type.sale")
      : t("pricing.type.override")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{priceList.title}</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge color={color}>{text}</StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: "edit",
                    icon: <PencilSquare />,
                  },
                ],
              },
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
          {t("pricing.fields.priceOverridesLabel")}
        </Text>
        <Text size="small" className="text-pretty">
          {overrideCount || "-"}
        </Text>
      </div>
    </Container>
  )
}
