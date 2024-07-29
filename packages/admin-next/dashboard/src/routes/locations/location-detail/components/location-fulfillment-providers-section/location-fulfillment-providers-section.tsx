import { HandTruck, PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { ListSummary } from "../../../../../components/common/list-summary"
import { useFulfillmentProviders } from "../../../../../hooks/api"

type LocationsFulfillmentProvidersSectionProps = {
  location: HttpTypes.AdminStockLocation
}

function LocationsFulfillmentProvidersSection({
  location,
}: LocationsFulfillmentProvidersSectionProps) {
  const { t } = useTranslation()
  const { count } = useFulfillmentProviders({
    limit: 1,
    fields: "id",
  })

  return (
    <Container className="flex flex-col px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">
          {t("stockLocations.fulfillmentProviders.header")}
        </Heading>

        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "fulfillment-providers",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>

      {location?.fulfillment_providers?.length ? (
        <div className="flex flex-col gap-y-4 pt-4">
          <div className="grid grid-cols-[28px_1fr] items-center gap-x-3">
            <IconAvatar>
              <HandTruck className="text-ui-fg-subtle" />
            </IconAvatar>

            <ListSummary
              n={2}
              className="text-ui-fg-base"
              inline
              list={location?.fulfillment_providers?.map((fp) => fp.id) ?? []}
            />
          </div>

          <Text className="text-ui-fg-subtle" size="small" leading="compact">
            {t("stockLocations.fulfillmentProviders.connectedTo", {
              count: location?.fulfillment_providers?.length,
              total: count,
            })}
          </Text>
        </div>
      ) : (
        <NoRecords
          className="h-fit pb-2 pt-6 text-center"
          action={{
            label: t("stockLocations.fulfillmentProviders.action"),
            to: "fulfillment-providers",
          }}
          message={t("stockLocations.fulfillmentProviders.noProviders")}
        />
      )}
    </Container>
  )
}

export default LocationsFulfillmentProvidersSection
