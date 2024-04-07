import { Button, Container, Text } from "@medusajs/ui"
import { FulfillmentSetDTO, StockLocationDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Buildings } from "@medusajs/icons"

import { countries } from "../../../../../lib/countries"
import { useCreateFulfillmentSet } from "../../../../../hooks/api/stock-locations.tsx"

enum FulfillmentSetType {
  Delivery = "delivery",
  Pickup = "pickup",
}

type FulfillmentSetProps = {
  fulfillmentSet?: FulfillmentSetDTO
  locationName: string
  type: FulfillmentSetType
}

function FulfillmentSet(props: FulfillmentSetProps) {
  const { t } = useTranslation()
  const { fulfillmentSet, locationName, type } = props

  const { mutateAsync, isPending: isLoading } = useCreateFulfillmentSet(
    location.id
  )

  const isPickup = fulfillmentSet?.type === FulfillmentSetType.Pickup
  const isDelivery = fulfillmentSet?.type === FulfillmentSetType.Delivery

  const enable = async () => {
    await mutateAsync({
      name: `${locationName} ${type}`,
      type: type,
    })
  }

  const hasServiceZones = !!fulfillmentSet.service_zones?.length

  return (
    <div className="flex flex-col px-6 py-5">
      <Text
        size="small"
        weight="plus"
        className="text-ui-fg-subtle mb-4"
        as="div"
      >
        {t("shipping.to")}
      </Text>

      {!hasServiceZones && (
        <div className="text-ui-fg-muted txt-medium flex h-[120px] items-center justify-center">
          {t("shipping.fulfillmentSet.placeholder")}
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

      <FulfillmentSet type={FulfillmentSetType.Pickup} fulfillmentSet={f} />
    </Container>
  )
}

export default Location
