import { PencilSquare, Trash } from "@medusajs/icons"
import { Discount } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteDiscount } from "medusa-react"
import { useTranslation } from "react-i18next"

import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  getDiscountStatus,
  PromotionStatus,
} from "../../../../../lib/discounts"

type DiscountGeneralSectionProps = {
  discount: Discount
}

export const DiscountGeneralSection = ({
  discount,
}: DiscountGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useAdminDeleteDiscount(discount.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("discounts.deleteWarning", {
        code: discount.code,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: discount.code,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/discounts", { replace: true })
      },
    })
  }

  const [color, text] = {
    [PromotionStatus.DISABLED]: [
      "grey",
      t("discounts.discountStatus.disabled"),
    ],
    [PromotionStatus.ACTIVE]: ["green", t("discounts.discountStatus.active")],
    [PromotionStatus.SCHEDULED]: [
      "orange",
      t("discounts.discountStatus.scheduled"),
    ],
    [PromotionStatus.EXPIRED]: ["red", t("discounts.discountStatus.expired")],
  }[getDiscountStatus(discount)] as [
    "grey" | "orange" | "green" | "red",
    string,
  ]

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>{discount.code}</Heading>
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
                    to: `/discounts/${discount.id}/edit`,
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
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact" className="text-pretty">
          {discount.rule.description || "-"}
        </Text>
      </div>
    </Container>
  )
}
