import { PencilSquare, Trash } from "@medusajs/icons"
import { Badge, Container, Heading, Text, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu/index.ts"
import { ListSummary } from "../../../../../components/common/list-summary/index.ts"
import { useDeleteRegion } from "../../../../../hooks/api/regions.tsx"
import { currencies } from "../../../../../lib/currencies.ts"
import { formatProvider } from "../../../../../lib/format-provider.ts"

type RegionGeneralSectionProps = {
  region: HttpTypes.AdminRegion
}

export const RegionGeneralSection = ({ region }: RegionGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{region.name}</Heading>
        <RegionActions region={region} />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.currency")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Badge size="2xsmall" className="uppercase">
            {region.currency_code}
          </Badge>
          <Text size="small" leading="compact">
            {currencies[region.currency_code.toUpperCase()].name}
          </Text>
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.paymentProviders")}
        </Text>
        <div className="inline-flex">
          {region.payment_providers?.length > 0 ? (
            <ListSummary
              list={region.payment_providers.map((p) => formatProvider(p.id))}
            />
          ) : (
            "-"
          )}
        </div>
      </div>
    </Container>
  )
}

const RegionActions = ({ region }: { region: HttpTypes.AdminRegion }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { mutateAsync } = useDeleteRegion(region.id)
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

    try {
      await mutateAsync(undefined)
      toast.success(t("general.success"), {
        description: t("regions.toast.delete"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
    navigate("/settings/regions", { replace: true })
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
