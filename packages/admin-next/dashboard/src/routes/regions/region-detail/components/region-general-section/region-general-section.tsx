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
import { SectionRow } from "../../../../../components/common/section/section-row.tsx"

type RegionGeneralSectionProps = {
  region: HttpTypes.AdminRegion
  pricePreferences: HttpTypes.AdminPricePreference[]
}

export const RegionGeneralSection = ({
  region,
  pricePreferences,
}: RegionGeneralSectionProps) => {
  const { t } = useTranslation()
  const pricePreferenceForRegion = pricePreferences?.find(
    (preference) =>
      preference.attribute === "region_id" && preference.value === region.id
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{region.name}</Heading>
        <RegionActions region={region} />
      </div>
      <SectionRow
        title={t("fields.currency")}
        value={
          <div className="flex items-center gap-x-2">
            <Badge size="2xsmall" className="uppercase">
              {region.currency_code}
            </Badge>
            <Text size="small" leading="compact">
              {currencies[region.currency_code.toUpperCase()].name}
            </Text>
          </div>
        }
      />

      <SectionRow
        title={t("fields.automaticTaxes")}
        value={region.automatic_taxes ? t("fields.true") : t("fields.false")}
      />

      <SectionRow
        title={t("fields.taxInclusivePricing")}
        value={
          pricePreferenceForRegion?.is_tax_inclusive
            ? t("fields.true")
            : t("fields.false")
        }
      />

      <SectionRow
        title={t("fields.paymentProviders")}
        value={
          <div className="inline-flex">
            {region.payment_providers?.length ? (
              <ListSummary
                list={region.payment_providers.map((p) => formatProvider(p.id))}
              />
            ) : (
              "-"
            )}
          </div>
        }
      />
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

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("regions.toast.delete"))
        navigate("/settings/regions", { replace: true })
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
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
