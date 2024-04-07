import { Button, Container, Text } from "@medusajs/ui"
import { FulfillmentSetDTO, StockLocationDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Buildings, Trash } from "@medusajs/icons"

import { countries } from "../../../../../lib/countries"
import {
  useCreateFulfillmentSet,
  useDeleteFulfillmentSet,
} from "../../../../../hooks/api/stock-locations.tsx"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useNavigate } from "react-router-dom"

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

type FulfillmentSetProps = {
  fulfillmentSet?: FulfillmentSetDTO
  locationName: string
  locationId: string
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { fulfillmentSet, locationName, locationId, type } = props

  const fulfillmentSetExists = !!fulfillmentSet
  const hasServiceZones = !!fulfillmentSet?.service_zones?.length

  const { mutateAsync: createFulfillmentSet, isPending: isLoading } =
    useCreateFulfillmentSet(locationId)

  const { mutateAsync: deleteFulfillmentSet } = useDeleteFulfillmentSet(
    locationId,
    fulfillmentSet?.id
  )

  // const isPickup = fulfillmentSet?.type === FulfillmentSetType.Pickup
  // const isDelivery = fulfillmentSet?.type === FulfillmentSetType.Delivery

  const handleCreate = async () => {
    await createFulfillmentSet({
      name: `${locationName} ${type}`,
      type: type,
    })
  }

  const handleDelete = async () => {
    await deleteFulfillmentSet()
  }

  return (
    <div className="flex flex-col px-6 py-5">
      <div className="flex items-center justify-between">
        <Text size="small" weight="plus" className="text-ui-fg-subtle" as="div">
          {t(`shipping.fulfillmentSet.${type}.title`)}
        </Text>
        {!fulfillmentSetExists ? (
          <Button onClick={handleCreate} variant="secondary">
            {t(`shipping.fulfillmentSet.${type}.enable`)}
          </Button>
        ) : (
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        )}
      </div>

      {fulfillmentSetExists && !hasServiceZones && (
        <div className="text-ui-fg-muted txt-medium flex h-[120px] flex-col items-center justify-center gap-y-4">
          <div>{t("shipping.fulfillmentSet.placeholder")}</div>
          <Button
            variant="secondary"
            onClick={() =>
              navigate(
                `/settings/shipping/location/${locationId}/fulfillment-set/${fulfillmentSet.id}/service-zones/create`
              )
            }
          >
            {t("shipping.fulfillmentSet.addZone")}
          </Button>
        </div>
      )}
    </div>
  )
}

type LocationProps = {
  location: StockLocationDTO
}

function Location(props: LocationProps) {
  const { location } = props
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col divide-y p-0">
      <div className="px-6 py-5">
        <Text
          size="small"
          weight="plus"
          className="text-ui-fg-subtle mb-4"
          as="div"
        >
          {t("shipping.from")}
        </Text>

        <div className="flex flex-row items-center justify-between gap-x-4">
          {/*ICON*/}
          <div className="grow-0 rounded-lg border">
            <div className="bg-ui-bg-field m-1 rounded-md p-2">
              <Buildings className="text-ui-fg-subtle" />
            </div>
          </div>

          {/*LOCATION INFO*/}
          <div className="grow-1 flex flex-1 flex-col">
            <Text weight="plus">{location.name}</Text>
            <Text className="text-ui-fg-subtle txt-small">
              {location.address?.city},{" "}
              {
                countries.find(
                  (c) =>
                    location.address?.country_code.toLowerCase() === c.iso_2
                )?.display_name
              }
            </Text>
          </div>

          {/*ACTION*/}
          <div className="flex grow-0 gap-2">{/*// TODO*/}</div>
        </div>
      </div>

      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Pickup}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Pickup
        )}
      />
      <FulfillmentSet
        locationId={location.id}
        locationName={location.name}
        type={FulfillmentSetType.Delivery}
        fulfillmentSet={location.fulfillment_sets.find(
          (f) => f.type === FulfillmentSetType.Delivery
        )}
      />
    </Container>
  )
}

export default Location
