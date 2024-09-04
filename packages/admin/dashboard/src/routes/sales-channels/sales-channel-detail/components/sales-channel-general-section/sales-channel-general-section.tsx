import { PencilSquare, Trash } from "@medusajs/icons"
import {
  Container,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { SalesChannelDTO } from "@medusajs/types"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteSalesChannel } from "../../../../../hooks/api/sales-channels"

type SalesChannelGeneralSectionProps = {
  salesChannel: SalesChannelDTO
}

export const SalesChannelGeneralSection = ({
  salesChannel,
}: SalesChannelGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteSalesChannel(salesChannel.id)

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
        toast.success(t("salesChannels.toast.delete"))
        navigate("/settings/sales-channels", { replace: true })
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{salesChannel.name}</Heading>
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
      <div className="text-ui-fg-subtle grid grid-cols-2 items-start px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact">
          {salesChannel.description || "-"}
        </Text>
      </div>
    </Container>
  )
}
