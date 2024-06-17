import { PencilSquare, Trash } from "@medusajs/icons"
import { PromotionDTO } from "@medusajs/types"
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
import {
  getPromotionStatus,
  PromotionStatus,
} from "../../../../../lib/promotions"

type PromotionGeneralSectionProps = {
  promotion: PromotionDTO
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

  const [color, text] = {
    [PromotionStatus.DISABLED]: ["grey", t("statuses.disabled")],
    [PromotionStatus.ACTIVE]: ["green", t("statuses.active")],
    [PromotionStatus.SCHEDULED]: ["orange", t("statuses.scheduled")],
    [PromotionStatus.EXPIRED]: ["red", t("statuses.expired")],
  }[getPromotionStatus(promotion)] as [
    "grey" | "orange" | "green" | "red",
    string,
  ]

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
          {t("promotions.fields.method")}
        </Text>

        <Text size="small" leading="compact" className="text-pretty">
          {promotion.is_automatic ? "Promotion code" : "Automatic"}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("fields.code")}
        </Text>

        <div className="flex items-center gap-1">
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="text-pretty"
          >
            {promotion.code}
          </Text>

          <Copy content={promotion.code!} variant="mini" />
        </div>
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

        <Text size="small" leading="compact" className="text-pretty">
          <Text className="inline pr-3" size="small" leading="compact">
            {promotion.application_method?.value}
          </Text>

          {promotion?.application_method?.type === "fixed" && (
            <Badge size="xsmall">
              {promotion?.application_method?.currency_code}
            </Badge>
          )}
        </Text>
      </div>

      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" weight="plus" leading="compact">
          {t("promotions.fields.allocation")}
        </Text>

        <Text size="small" leading="compact" className="text-pretty capitalize">
          {promotion.application_method?.allocation!}
        </Text>
      </div>
    </Container>
  )
}
