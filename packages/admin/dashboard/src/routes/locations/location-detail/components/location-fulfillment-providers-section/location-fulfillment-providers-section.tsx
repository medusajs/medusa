import { HandTruck, PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { IconAvatar } from "../../../../../components/common/icon-avatar"
import { useFulfillmentProviders } from "../../../../../hooks/api"
import { useStockLocationPermissions } from "../../../../../hooks/use-resource-permissions"
import { formatProvider } from "../../../../../lib/format-provider"

type LocationsFulfillmentProvidersSectionProps = {
  location: HttpTypes.AdminStockLocation
}

function LocationsFulfillmentProvidersSection({
  location,
}: LocationsFulfillmentProvidersSectionProps) {
  const { t } = useTranslation()
  const { canUpdate } = useStockLocationPermissions()
  const { fulfillment_providers } = useFulfillmentProviders({
    stock_location_id: location.id,
    fields: "id",
    is_enabled: true,
  })

  return (
    <Container className="flex flex-col px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">
          {t("stockLocations.fulfillmentProviders.header")}
        </Heading>

        {canUpdate && (
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
        )}
      </div>

      {fulfillment_providers?.length ? (
        <div className="flex flex-col gap-y-4 pt-4">
          <div className="grid grid-cols-[28px_1fr] items-center gap-x-3 gap-y-3">
            {fulfillment_providers?.map((fulfillmentProvider) => {
              return (
                <Fragment key={fulfillmentProvider.id}>
                  <IconAvatar>
                    <HandTruck className="text-ui-fg-subtle" />
                  </IconAvatar>

                  <div className="txt-compact-small">
                    {formatProvider(fulfillmentProvider.id)}
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>
      ) : (
        <NoRecords
          className="h-fit pb-2 pt-6 text-center"
          action={
            canUpdate
              ? {
                  label: t("stockLocations.fulfillmentProviders.action"),
                  to: "fulfillment-providers",
                }
              : undefined
          }
          message={t("stockLocations.fulfillmentProviders.noProviders")}
        />
      )}
    </Container>
  )
}

export default LocationsFulfillmentProvidersSection
