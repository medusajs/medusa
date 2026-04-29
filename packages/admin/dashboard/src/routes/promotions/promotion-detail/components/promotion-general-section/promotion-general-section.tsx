import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeletePromotion } from "../../../../../hooks/api/promotions"
import { formatCurrency } from "../../../../../lib/format-currency"
import { formatPercentage } from "../../../../../lib/percentage-helpers"
import { getPromotionStatus } from "../../../../../lib/promotions"

type PromotionGeneralSectionProps = {
  promotion: HttpTypes.AdminPromotion
}

function getDisplayValue(promotion: HttpTypes.AdminPromotion) {
  const value = promotion.application_method?.value

  if (!value) {
    return null
  }

  if (promotion.application_method?.type === "fixed") {
    const currency = promotion.application_method?.currency_code

    if (!currency) {
      return null
    }

    return formatCurrency(value, currency)
  } else if (promotion.application_method?.type === "percentage") {
    return formatPercentage(value)
  }

  return null
}

export const PromotionGeneralSection = ({
  promotion,
}: PromotionGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { mutateAsync } = useDeletePromotion(promotion.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("promotions.deleteWarning", {
        code: promotion.code,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: promotion.code,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/promotions", { replace: true })
      },
    })
  }

  const [color, text] = getPromotionStatus(promotion)
  const displayValue = getDisplayValue(promotion)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>{promotion.code}</Heading>
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
                    to: `/promotions/${promotion.id}/edit`,
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
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("promotions.fields.campaign")}
        </Text>

        <Text size="small" leading="compact" className="text-pretty">
          {promotion.is_automatic
            ? t("promotions.form.method.automatic.title")
            : t("promotions.form.method.code.title")}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.code")}
        </Text>

        <Copy
          content={promotion.code!}
          className="text-ui-tag-neutral-text"
          asChild
        >
          <Badge
            size="2xsmall"
            rounded="full"
            className="cursor-pointer text-pretty"
          >
            {promotion.code}
          </Badge>
        </Copy>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("promotions.fields.type")}
        </Text>

        <Text size="small" leading="compact" className="text-pretty capitalize">
          {promotion.type}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("promotions.fields.value")}
        </Text>

        <div className="flex items-center gap-x-2">
          <Text className="inline" size="small" leading="compact">
            {displayValue || "-"}
          </Text>
          {promotion?.application_method?.type === "fixed" && (
            <Badge size="2xsmall" rounded="full">
              {promotion?.application_method?.currency_code?.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("promotions.fields.allocation")}
        </Text>

        <Text size="small" leading="compact" className="text-pretty capitalize">
          {promotion.application_method?.allocation!}
        </Text>
      </div>

      {promotion.application_method?.type === "fixed" && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            {t("promotions.fields.taxInclusive")}
          </Text>

          <div className="flex items-center gap-x-2">
            <Text className="inline" size="small" leading="compact">
              {promotion.is_tax_inclusive
                ? t("fields.true")
                : t("fields.false")}
            </Text>
          </div>
        </div>
      )}

      {typeof promotion.limit === "number" && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
          <Text size="small" weight="plus" leading="compact">
            Usage Limit
          </Text>

          <div className="flex items-center gap-x-2">
            <Text className="inline" size="small" leading="compact">
              {promotion.used || 0} / {promotion.limit}
            </Text>
          </div>
        </div>
      )}
    </Container>
  )
}
