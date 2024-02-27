import { PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannel } from "@medusajs/medusa"
import { Container, Heading, StatusBadge, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteSalesChannel } from "medusa-react"
import { useTranslation } from "react-i18next"

import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type SalesChannelGeneralSection = {
  salesChannel: SalesChannel
}

export const SalesChannelGeneralSection = ({
  salesChannel,
}: SalesChannelGeneralSection) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useAdminDeleteSalesChannel(salesChannel.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.deleteSalesChannelWarning", {
        name: salesChannel.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: salesChannel.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/settings/sales-channels", { replace: true })
      },
    })
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <Heading>{salesChannel.name}</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            {salesChannel.description}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <StatusBadge color={salesChannel.is_disabled ? "red" : "green"}>
            {t(`general.${salesChannel.is_disabled ? "disabled" : "enabled"}`)}
          </StatusBadge>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <PencilSquare />,
                    label: t("actions.edit"),
                    to: `/settings/sales-channels/${salesChannel.id}/edit`,
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
    </Container>
  )
}
