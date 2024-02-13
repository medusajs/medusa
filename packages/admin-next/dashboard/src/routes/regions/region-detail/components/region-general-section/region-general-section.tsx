import { PencilSquare, Trash } from "@medusajs/icons"
import { Country, Region } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Container,
  Drawer,
  Heading,
  StatusBadge,
  Text,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import { useAdminDeleteRegion, useAdminUpdateRegion } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { ActionMenu } from "../../../../../components/common/action-menu"

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
          {t("fields.countries")}
        </Text>
        <RegionCountries countries={region.countries} />
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
          {t("fields.taxInclusivePricing")}
        </Text>
        <StatusBadge
          color={region.includes_tax ? "green" : "red"}
          className="w-fit"
        >
          {region.includes_tax ? t("general.enabled") : t("general.disabled")}
        </StatusBadge>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.paymentProviders")}
        </Text>
        <Text size="small" leading="compact">
          {region.payment_providers.length > 0
            ? region.payment_providers.map((p) => p.id).join(", ")
            : "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.fulfillmentProviders")}
        </Text>
        <Text size="small" leading="compact">
          {region.fulfillment_providers.length > 0
            ? region.fulfillment_providers.map((p) => p.id).join(", ")
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

const RegionCountries = ({ countries }: { countries: Country[] }) => {
  const { t } = useTranslation()

  const countIsGreaterThanTwo = countries.length > 2

  return (
    <div className="text-ui-fg-subtle flex items-center gap-x-2">
      <Text leading="compact" size="small">
        {countries
          .slice(0, 2)
          .map((c) => c.display_name)
          .join(", ")}
        {countIsGreaterThanTwo && ", "}
      </Text>
      {countIsGreaterThanTwo && (
        <Tooltip
          content={
            <ul>
              {countries.slice(2).map((c) => (
                <li key={c.id}>{c.display_name}</li>
              ))}
            </ul>
          }
        >
          <Text
            leading="compact"
            size="small"
            weight="plus"
            className="cursor-default"
          >
            {t("general.plusCountMore", {
              count: countries.length - 2,
            })}
          </Text>
        </Tooltip>
      )}
    </div>
  )
}

const EditRegionSchema = zod.object({
  name: zod.string().min(1),
  includes_tax: zod.boolean(),
  currency_code: zod.string(),
  countries: zod.array(zod.string()),
})

const EditRegionDrawer = ({ region }: { region: Region }) => {
  const { t } = useTranslation()
  const { mutateAsync, isLoading } = useAdminUpdateRegion(region.id)

  const form = useForm<zod.infer<typeof EditRegionSchema>>({
    defaultValues: {
      name: region.name,
      currency_code: region.currency_code,
      includes_tax: region.includes_tax,
      countries: region.countries.map((c) => c.iso_2),
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync({
      name: values.name,
      currency_code: values.currency_code,
      includes_tax: values.includes_tax,
    })
  })

  return (
    <Drawer>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("regions.editRegion")}</Heading>
        </Drawer.Header>
        <Drawer.Body></Drawer.Body>
        <Drawer.Footer className="flex items-center justify-end gap-x-2">
          <Button variant="secondary">{t("actions.cancel")}</Button>
          <Button>{t("actions.save")}</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}
