import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannel } from "@medusajs/medusa"
import {
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  usePrompt,
} from "@medusajs/ui"
import { useAdminDeleteSalesChannel } from "medusa-react"
import { useTranslation } from "react-i18next"

import { Link, useNavigate } from "react-router-dom"

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
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
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
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton variant="transparent">
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <Link to={`/settings/sales-channels/${salesChannel.id}/edit`}>
                <DropdownMenu.Item className="gap-x-2">
                  <PencilSquare className="text-ui-fg-subtle" />
                  <span>{t("general.edit")}</span>
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Separator />
              <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
                <Trash className="text-ui-fg-subtle" />
                <span>{t("general.delete")}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
    </Container>
  )
}
