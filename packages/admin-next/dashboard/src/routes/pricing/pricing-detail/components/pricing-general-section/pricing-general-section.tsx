import { PencilSquare, Trash } from "@medusajs/icons"
import { PriceList } from "@medusajs/medusa"
import {
  Container,
  Heading,
  StatusBadge,
  Text,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { useAdminDeletePriceList } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { getPriceListStatus } from "../../../common/utils"

type PricingGeneralSectionProps = {
  priceList: PriceList
}

export const PricingGeneralSection = ({
  priceList,
}: PricingGeneralSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeletePriceList(priceList.id)

  const overrideCount = priceList.prices?.length || 0
  const firstCustomerGroups = priceList.customer_groups?.slice(0, 3)
  const remainingCustomerGroups = priceList.customer_groups?.slice(3)

  const { color, text } = getPriceListStatus(t, priceList)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("pricing.deletePriceListWarning", {
        name: priceList.name,
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

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{priceList.name}</Heading>
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
          {t("fields.description")}
        </Text>
        <Text size="small" className="text-pretty">
          {priceList.description}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("pricing.settings.customerGroupsLabel")}
        </Text>
        <Text size="small" className="text-pretty">
          <span>
            {firstCustomerGroups.length > 0
              ? firstCustomerGroups.join(", ")
              : "-"}
          </span>
          {remainingCustomerGroups.length > 0 && (
            <Tooltip
              content={
                <ul>
                  {remainingCustomerGroups.map((cg) => (
                    <li key={cg.id}>{cg.name}</li>
                  ))}
                </ul>
              }
            >
              <span className="text-ui-fg-muted">
                {" "}
                {t("general.plusCountMore", {
                  count: remainingCustomerGroups.length,
                })}
              </span>
            </Tooltip>
          )}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text leading="compact" size="small" weight="plus">
          {t("pricing.settings.priceOverridesLabel")}
        </Text>
        <Text size="small" className="text-pretty">
          {overrideCount || "-"}
        </Text>
      </div>
    </Container>
  )
}
