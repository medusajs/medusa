import { BuildingTax, PencilSquare, Trash } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Badge, Container, Heading, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { formatProvider } from "../../../../../lib/format-provider"

type RegionGeneralSectionProps = {
  region: Region
}

export const RegionGeneralSection = ({ region }: RegionGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{region.name}</Heading>
        <RegionActions region={region} />
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.currency")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Badge size="2xsmall" className="uppercase">
            {region.currency_code}
          </Badge>
          <Text size="small" leading="compact">
            {region.currency?.name}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.paymentProviders")}
        </Text>
        <Text size="small" leading="compact">
          {region.payment_providers.length > 0
            ? region.payment_providers
                .map((p) => formatProvider(p.id))
                .join(", ")
            : "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.fulfillmentProviders")}
        </Text>
        <Text size="small" leading="compact">
          {region.fulfillment_providers.length > 0
            ? region.fulfillment_providers
                .map((p) => formatProvider(p.id))
                .join(", ")
            : "-"}
        </Text>
      </div>
    </Container>
  )
}

const RegionActions = ({ region }: { region: Region }) => {
  const { t } = useTranslation()
  const { mutateAsync } = useAdminDeleteRegion(region.id)
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.deleteRegionWarning", {
        name: region.name,
      }),
      verificationText: region.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined)
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/regions/${region.id}/edit`,
            },
            {
              icon: <BuildingTax />,
              label: "Tax settings",
              to: `/settings/taxes/${region.id}`,
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
