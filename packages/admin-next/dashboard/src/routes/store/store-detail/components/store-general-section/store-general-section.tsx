import { PencilSquare } from "@medusajs/icons"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useRegion } from "../../../../../hooks/api/regions"
import { ExtendedStoreDTO } from "../../../../../types/api-responses"

type StoreGeneralSectionProps = {
  store: ExtendedStoreDTO
}

export const StoreGeneralSection = ({ store }: StoreGeneralSectionProps) => {
  const { t } = useTranslation()

  const { region } = useRegion(store.default_region_id, undefined, {
    enabled: !!store.default_region_id,
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: "edit",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {store.name}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.defaultCurrency")}
        </Text>
        {store.default_currency ? (
          <div className="flex items-center gap-x-2">
            <Badge size="2xsmall">
              {store.default_currency.code.toUpperCase()}
            </Badge>
            <Text size="small" leading="compact">
              {store.default_currency.name}
            </Text>
          </div>
        ) : (
          <Text size="small" leading="compact">
            -
          </Text>
        )}
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("store.defaultRegion")}
        </Text>
        <div className="flex items-center gap-x-2">
          <Text size="small" leading="compact">
            {region?.name || "-"}
          </Text>
        </div>
      </div>
    </Container>
  )
}
